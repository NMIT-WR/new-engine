"use client"

import DOMPurify from "dompurify"
import { useMemo } from "react"

type SafeHtmlContentProps = {
  content: string | null | undefined
  className?: string
  /** Custom DOMPurify config for allowed tags and attributes */
  config?: any // DOMPurify.Config type
}

/**
 * Safely renders HTML content with automatic detection and sanitization.
 * Detects if content contains HTML tags or entities and sanitizes accordingly.
 * Falls back to plain text rendering for non-HTML content.
 */
export function SafeHtmlContent({
  content,
  className,
  config,
}: SafeHtmlContentProps) {
  const processedContent = useMemo(() => {
    if (!content) {
      return { isHtml: false, content: "" }
    }

    // Check if content contains HTML tags or HTML entities
    const hasHtmlTags = /<[^>]*>/g.test(content)
    const hasHtmlEntities = /&#?\w+;/.test(content)
    const isHtml = hasHtmlTags || hasHtmlEntities

    if (isHtml) {
      // Default safe config for product descriptions
      const defaultConfig = {
        ALLOWED_TAGS: [
          "p",
          "br",
          "strong",
          "em",
          "b",
          "i",
          "u",
          "ul",
          "ol",
          "li",
          "h3",
          "h4",
          "h5",
          "h6",
          "span",
          "div",
        ],
        ALLOWED_ATTR: ["class", "style"],
        ALLOW_DATA_ATTR: false,
        FORBID_TAGS: ["script", "iframe", "form", "input"],
        FORBID_ATTR: ["onerror", "onclick", "onload"],
      }

      // Merge custom config with defaults
      const finalConfig = { ...defaultConfig, ...config }
      const sanitized = DOMPurify.sanitize(content, finalConfig)

      return { isHtml: true, content: String(sanitized) }
    }

    return { isHtml: false, content }
  }, [content, config])

  if (!processedContent.content) {
    return null
  }

  if (processedContent.isHtml) {
    return (
      <div
        className={className}
        // biome-ignore lint/security/noDangerouslySetInnerHtml: Already sanitized
        dangerouslySetInnerHTML={{ __html: processedContent.content }}
      />
    )
  }

  // Render plain text - React handles this safely by default
  return <p className={className}>{processedContent.content}</p>
}
