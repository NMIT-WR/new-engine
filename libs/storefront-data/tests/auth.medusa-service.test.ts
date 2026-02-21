import type { HttpTypes } from "@medusajs/types"
import { createMedusaAuthService } from "../src/auth/medusa-service"

type SdkLike = {
  auth: {
    register: ReturnType<typeof vi.fn>
    login: ReturnType<typeof vi.fn>
    refresh: ReturnType<typeof vi.fn>
    logout: ReturnType<typeof vi.fn>
  }
  store: {
    customer: {
      retrieve: ReturnType<typeof vi.fn>
      create: ReturnType<typeof vi.fn>
      update: ReturnType<typeof vi.fn>
    }
  }
}

function createSdkMock(overrides?: {
  logout?: SdkLike["auth"]["logout"]
  createCustomer?: SdkLike["store"]["customer"]["create"]
}): SdkLike {
  return {
    auth: {
      register: vi.fn().mockResolvedValue("token_1"),
      login: vi.fn().mockResolvedValue("token_1"),
      refresh: vi.fn().mockResolvedValue("token_2"),
      logout: overrides?.logout ?? vi.fn().mockResolvedValue(undefined),
    },
    store: {
      customer: {
        retrieve: vi
          .fn()
          .mockResolvedValue({ customer: { id: "cus_1" } as HttpTypes.StoreCustomer }),
        create:
          overrides?.createCustomer ??
          vi
            .fn()
            .mockResolvedValue({
              customer: { id: "cus_1" } as HttpTypes.StoreCustomer,
            }),
        update: vi
          .fn()
          .mockResolvedValue({ customer: { id: "cus_1" } as HttpTypes.StoreCustomer }),
      },
    },
  }
}

describe("createMedusaAuthService", () => {
  it("logs logout errors by default and keeps logout as best effort", async () => {
    const logoutError = new Error("logout failed")
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
    const sdk = createSdkMock({
      logout: vi.fn().mockRejectedValue(logoutError),
    })
    const service = createMedusaAuthService(sdk as never)

    await expect(service.logout()).resolves.toBeUndefined()

    expect(warnSpy).toHaveBeenCalledWith(
      "[storefront-data/auth] Failed to logout customer session.",
      logoutError
    )
  })

  it("calls custom logout reporter instead of default logging", async () => {
    const logoutError = new Error("logout failed")
    const onLogoutError = vi.fn()
    const warnSpy = vi.spyOn(console, "warn").mockImplementation(() => {})
    const sdk = createSdkMock({
      logout: vi.fn().mockRejectedValue(logoutError),
    })
    const service = createMedusaAuthService(sdk as never, { onLogoutError })

    await expect(service.logout()).resolves.toBeUndefined()

    expect(onLogoutError).toHaveBeenCalledWith(logoutError, "logout")
    expect(warnSpy).not.toHaveBeenCalled()
  })

  it("reports cleanup logout errors and rethrows original register failure", async () => {
    const registerError = new Error("customer create failed")
    const cleanupLogoutError = new Error("cleanup logout failed")
    const onLogoutError = vi.fn()
    const sdk = createSdkMock({
      createCustomer: vi.fn().mockRejectedValue(registerError),
      logout: vi.fn().mockRejectedValue(cleanupLogoutError),
    })
    const service = createMedusaAuthService(sdk as never, { onLogoutError })

    await expect(
      service.register({
        email: "john@example.com",
        password: "secret123",
      })
    ).rejects.toBe(registerError)

    expect(onLogoutError).toHaveBeenCalledWith(
      cleanupLogoutError,
      "register-cleanup"
    )
    expect(sdk.auth.logout).toHaveBeenCalledTimes(1)
  })
})
