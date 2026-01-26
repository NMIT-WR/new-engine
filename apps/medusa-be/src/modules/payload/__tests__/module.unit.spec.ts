jest.mock("@medusajs/framework/utils", () => ({
  Module: jest.fn(() => ({ __module: true })),
}))

describe("payload module", () => {
  it("registers the module with the payload service", () => {
    jest.isolateModules(() => {
      const { Module } = require("@medusajs/framework/utils")
      const moduleMock = Module as jest.Mock
      moduleMock.mockClear()
      const payloadModule = require("../index")
      const PayloadModuleService = require("../service").default

      expect(moduleMock).toHaveBeenCalledWith(payloadModule.PAYLOAD_MODULE, {
        service: PayloadModuleService,
      })
      expect(payloadModule.default).toBe(moduleMock.mock.results[0]?.value)
    })
  })
})
