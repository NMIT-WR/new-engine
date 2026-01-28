import { htmlEscape } from "../string"

describe("string utilities", () => {
  describe("htmlEscape", () => {
    it("escapes HTML special characters", () => {
      expect(htmlEscape(`&<>"'`)).toBe("&amp;&lt;&gt;&quot;&#39;")
    })

    it("returns the same string when no escaping is needed", () => {
      expect(htmlEscape("plain-text")).toBe("plain-text")
    })

    it("escapes mixed content safely", () => {
      expect(htmlEscape(`Tom & "Jerry" <3`)).toBe(
        "Tom &amp; &quot;Jerry&quot; &lt;3"
      )
    })
  })
})
