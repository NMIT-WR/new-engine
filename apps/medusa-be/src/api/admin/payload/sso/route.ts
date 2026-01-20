import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { SignJWT, importPKCS8 } from "jose"
import { getQueryParam } from "../../../../utils/query"

const DEFAULT_ISSUER = "medusa"
const DEFAULT_AUDIENCE = "payload"
const DEFAULT_ALG = "RS256"
const DEFAULT_TOKEN_TTL_SECONDS = 60

const normalizeKey = (value: string) => value.replace(/\\n/g, "\n").trim()

const sanitizeReturnTo = (value: string | undefined) => {
  if (!value) {
    return undefined
  }
  if (value.startsWith("/") && !value.startsWith("//")) {
    return value
  }
  return undefined
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const privateKey = process.env.PAYLOAD_SSO_PRIVATE_KEY
  const payloadIframeUrl = process.env.PAYLOAD_IFRAME_URL
  const ssoEmail = process.env.PAYLOAD_SSO_USER_EMAIL
  const issuer = process.env.PAYLOAD_SSO_ISSUER || DEFAULT_ISSUER
  const audience = process.env.PAYLOAD_SSO_AUDIENCE || DEFAULT_AUDIENCE
  const alg = process.env.PAYLOAD_SSO_ALG || DEFAULT_ALG
  const ttlEnv = process.env.PAYLOAD_SSO_TOKEN_TTL
    ? Number(process.env.PAYLOAD_SSO_TOKEN_TTL)
    : NaN
  const ttl =
    Number.isFinite(ttlEnv) && ttlEnv > 0
      ? ttlEnv
      : DEFAULT_TOKEN_TTL_SECONDS

  if (!privateKey || !payloadIframeUrl || !ssoEmail) {
    return res.status(500).json({
      message:
        "Payload SSO is not configured. Check PAYLOAD_SSO_PRIVATE_KEY, PAYLOAD_IFRAME_URL, and PAYLOAD_SSO_USER_EMAIL.",
    })
  }

  const returnTo = sanitizeReturnTo(getQueryParam(req, "returnTo"))
  const issuedAt = Math.floor(Date.now() / 1000)
  const expiresAt = issuedAt + ttl
  const key = await importPKCS8(normalizeKey(privateKey), alg)

  const token = await new SignJWT({ email: ssoEmail })
    .setProtectedHeader({ alg, typ: "JWT" })
    .setIssuedAt(issuedAt)
    .setExpirationTime(expiresAt)
    .setIssuer(issuer)
    .setAudience(audience)
    .setSubject(ssoEmail)
    .sign(key)

  const redirectUrl = new URL("/api/medusa-sso", payloadIframeUrl)
  const htmlEscape = (value: string) =>
    value.replace(/[&<>"']/g, (char) => {
      switch (char) {
        case "&":
          return "&amp;"
        case "<":
          return "&lt;"
        case ">":
          return "&gt;"
        case '"':
          return "&quot;"
        case "'":
          return "&#39;"
        default:
          return char
      }
    })

  const html = `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta http-equiv="cache-control" content="no-store" />
    <meta name="referrer" content="no-referrer" />
    <title>Signing in…</title>
  </head>
  <body onload="document.forms[0].submit()">
    <form method="POST" action="${htmlEscape(redirectUrl.toString())}">
      <input type="hidden" name="token" value="${htmlEscape(token)}" />
      ${
        returnTo
          ? `<input type="hidden" name="returnTo" value="${htmlEscape(returnTo)}" />`
          : ""
      }
    </form>
  </body>
</html>`

  res.setHeader("Content-Type", "text/html; charset=utf-8")
  res.setHeader("Cache-Control", "no-store")
  res.setHeader("Referrer-Policy", "no-referrer")
  return res.status(200).send(html)
}
