// Common color names to hex mapping
export const colorNameToHex: Record<string, string> = {
  // Basic colors
  'white': '#FFFFFF',
  'black': '#000000',
  'red': '#FF0000',
  'blue': '#0000FF',
  'green': '#008000',
  'yellow': '#FFFF00',
  'orange': '#FFA500',
  'purple': '#800080',
  'pink': '#FFC0CB',
  'brown': '#964B00',
  'gray': '#808080',
  'grey': '#808080',
  
  // Extended colors
  'navy': '#000080',
  'teal': '#008080',
  'silver': '#C0C0C0',
  'gold': '#FFD700',
  'beige': '#F5F5DC',
  'ivory': '#FFFFF0',
  'cream': '#FFFDD0',
  'tan': '#D2B48C',
  'khaki': '#F0E68C',
  'olive': '#808000',
  'maroon': '#800000',
  'coral': '#FF7F50',
  'salmon': '#FA8072',
  'peach': '#FFE5B4',
  'lavender': '#E6E6FA',
  'violet': '#EE82EE',
  'indigo': '#4B0082',
  'turquoise': '#40E0D0',
  'mint': '#3EB489',
  'emerald': '#50C878',
  'burgundy': '#800020',
  'wine': '#722F37',
  'charcoal': '#36454F',
  'slate': '#708090',
  'camel': '#C19A6B',
  'rust': '#B7410E',
  'sage': '#87A96B',
  'blush': '#DE5D83',
  'rose': '#FF007F',
  'sky': '#87CEEB',
  'sand': '#C2B280',
  'chocolate': '#7B3F00',
  'plum': '#DDA0DD',
  'mauve': '#E0B0FF',
  'oatmeal': '#D4B5A0',
  'forest green': '#228B22',
  
  // Denim washes
  'light wash': '#8BA8C7',
  'medium wash': '#5A7FA0',
  'dark wash': '#3B5369',
  'medium blue': '#4169E1',
  'dark blue': '#000080',
  'light blue': '#ADD8E6',
  
  // Patterns (default colors)
  'paisley blue': '#4169E1',
  'floral red': '#DC143C',
  'geometric': '#696969',
  'stripes': '#778899',
  'dots': '#708090',
  'plaid': '#8B4513',
  'checks': '#2F4F4F',
  
  // Material descriptors (default colors)
  'denim': '#1560BD',
  'leather': '#8B4513',
  'suede': '#A0826D',
  'cotton': '#FAF0E6',
  'wool': '#D3D3D3',
  'silk': '#F5F5F5',
  'linen': '#FAF0E6',
  'canvas': '#F0E68C',
}

export function getColorHex(colorName: string): string {
  const normalizedName = colorName.toLowerCase().trim()
  return colorNameToHex[normalizedName] || '#CCCCCC'
}