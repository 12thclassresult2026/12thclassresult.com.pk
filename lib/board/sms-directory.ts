export type BoardSmsInfo = {
  slug: string
  boardName: string
  shortcode: string | null
  prefix?: string
  format: string
  example: string
  supported: boolean
  networkCharges: string
  notes?: string
}

export const BOARD_SMS_DIRECTORY: Record<string, BoardSmsInfo> = {
  // Punjab Boards (All 9 use 80029x shortcodes)
  'lahore-board': {
    slug: 'lahore-board',
    boardName: 'BISE Lahore',
    shortcode: '800291',
    format: '[Roll Number]',
    example: '123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },
  'rawalpindi-board': {
    slug: 'rawalpindi-board',
    boardName: 'BISE Rawalpindi',
    shortcode: '800296',
    format: '[Roll Number]',
    example: '123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },
  'faisalabad-board': {
    slug: 'faisalabad-board',
    boardName: 'BISE Faisalabad',
    shortcode: '800240',
    format: '[Roll Number]',
    example: '123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },
  'multan-board': {
    slug: 'multan-board',
    boardName: 'BISE Multan',
    shortcode: '800293',
    format: '[Roll Number]',
    example: '123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },
  'gujranwala-board': {
    slug: 'gujranwala-board',
    boardName: 'BISE Gujranwala',
    shortcode: '800299',
    format: '[Roll Number]',
    example: '123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },
  'sargodha-board': {
    slug: 'sargodha-board',
    boardName: 'BISE Sargodha',
    shortcode: '800290',
    format: '[Roll Number]',
    example: '123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },
  'bahawalpur-board': {
    slug: 'bahawalpur-board',
    boardName: 'BISE Bahawalpur',
    shortcode: '800298',
    format: '[Roll Number]',
    example: '123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },
  'sahiwal-board': {
    slug: 'sahiwal-board',
    boardName: 'BISE Sahiwal',
    shortcode: '800292',
    format: '[Roll Number]',
    example: '123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },
  'dg-khan-board': {
    slug: 'dg-khan-board',
    boardName: 'BISE D.G. Khan',
    shortcode: '800295',
    format: '[Roll Number]',
    example: '123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },

  // Federal Board (Islamabad)
  'federal-board': {
    slug: 'federal-board',
    boardName: 'Federal Board (FBISE)',
    shortcode: '5050',
    prefix: 'FB ',
    format: 'FB [Roll Number]',
    example: 'FB 123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },

  // Khyber Pakhtunkhwa (KPK) Boards (All use 9818 with board prefix)
  'peshawar-board': {
    slug: 'peshawar-board',
    boardName: 'BISE Peshawar',
    shortcode: '9818',
    prefix: 'BISEP ',
    format: 'BISEP [Roll Number]',
    example: 'BISEP 123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },
  'mardan-board': {
    slug: 'mardan-board',
    boardName: 'BISE Mardan',
    shortcode: '9818',
    prefix: 'BISEM ',
    format: 'BISEM [Roll Number]',
    example: 'BISEM 123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },
  'abbottabad-board': {
    slug: 'abbottabad-board',
    boardName: 'BISE Abbottabad',
    shortcode: '9818',
    prefix: 'BISEA ',
    format: 'BISEA [Roll Number]',
    example: 'BISEA 123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },
  'swat-board': {
    slug: 'swat-board',
    boardName: 'BISE Saidu Sharif Swat',
    shortcode: '9818',
    prefix: 'BISESS ',
    format: 'BISESS [Roll Number]',
    example: 'BISESS 123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },
  'kohat-board': {
    slug: 'kohat-board',
    boardName: 'BISE Kohat',
    shortcode: '9818',
    prefix: 'BISEK ',
    format: 'BISEK [Roll Number]',
    example: 'BISEK 123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },
  'bannu-board': {
    slug: 'bannu-board',
    boardName: 'BISE Bannu',
    shortcode: '9818',
    prefix: 'BISEB ',
    format: 'BISEB [Roll Number]',
    example: 'BISEB 123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },
  'malakand-board': {
    slug: 'malakand-board',
    boardName: 'BISE Malakand',
    shortcode: '9818',
    prefix: 'BISEMK ',
    format: 'BISEMK [Roll Number]',
    example: 'BISEMK 123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },
  'dera-ismail-khan-board': {
    slug: 'dera-ismail-khan-board',
    boardName: 'BISE Dera Ismail Khan',
    shortcode: '9818',
    prefix: 'BISEDIK ',
    format: 'BISEDIK [Roll Number]',
    example: 'BISEDIK 123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },

  // Sindh Boards
  'karachi-board': {
    slug: 'karachi-board',
    boardName: 'BIEK Karachi',
    shortcode: null,
    format: 'Official Gazette / Portal Only',
    example: 'Search via Gazette',
    supported: false,
    networkCharges: 'N/A',
    notes:
      'BIEK Karachi does not provide an official SMS result shortcode. 12th class results are published exclusively via Gazette and the official portal.',
  },
  'hyderabad-board': {
    slug: 'hyderabad-board',
    boardName: 'BISE Hyderabad',
    shortcode: '8583',
    prefix: 'BISEH ',
    format: 'BISEH [Roll Number]',
    example: 'BISEH 123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },
  'sukkur-board': {
    slug: 'sukkur-board',
    boardName: 'BISE Sukkur',
    shortcode: '8583',
    prefix: 'BISES ',
    format: 'BISES [Roll Number]',
    example: 'BISES 123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },
  'larkana-board': {
    slug: 'larkana-board',
    boardName: 'BISE Larkana',
    shortcode: '8583',
    prefix: 'BISEL ',
    format: 'BISEL [Roll Number]',
    example: 'BISEL 123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },
  'mirpurkhas-board': {
    slug: 'mirpurkhas-board',
    boardName: 'BISE Mirpurkhas',
    shortcode: '8583',
    prefix: 'BISEM ',
    format: 'BISEM [Roll Number]',
    example: 'BISEM 123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },
  'shaheed-benazirabad-board': {
    slug: 'shaheed-benazirabad-board',
    boardName: 'BISE Shaheed Benazirabad',
    shortcode: '8583',
    prefix: 'BISESB ',
    format: 'BISESB [Roll Number]',
    example: 'BISESB 123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },

  // Balochistan
  'quetta-board': {
    slug: 'quetta-board',
    boardName: 'BBISE Quetta',
    shortcode: '8059',
    prefix: 'BBISE ',
    format: 'BBISE [Roll Number]',
    example: 'BBISE 123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },

  // Azad Jammu & Kashmir
  'mirpur-board': {
    slug: 'mirpur-board',
    boardName: 'AJK BISE Mirpur',
    shortcode: '5050',
    prefix: 'AJK ',
    format: 'AJK [Roll Number]',
    example: 'AJK 123456',
    supported: true,
    networkCharges: 'Standard charges apply (Rs. 1.5 - 2 + tax)',
  },

  // Specialized / Private Boards
  'aku-eb': {
    slug: 'aku-eb',
    boardName: 'AKU-EB',
    shortcode: null,
    format: 'Online Candidate Portal Only',
    example: 'Check result via candidate portal',
    supported: false,
    networkCharges: 'N/A',
    notes:
      'Aga Khan University Examination Board publishes results exclusively through its secure online candidate portal.',
  },
  zueb: {
    slug: 'zueb',
    boardName: 'ZUEB',
    shortcode: null,
    format: 'Online Portal Only',
    example: 'Check result via official portal',
    supported: false,
    networkCharges: 'N/A',
    notes: 'Ziauddin Examination Board publishes results exclusively through its official portal.',
  },
}

export function getBoardSmsInfo(slug: string): BoardSmsInfo {
  if (BOARD_SMS_DIRECTORY[slug]) {
    return BOARD_SMS_DIRECTORY[slug]
  }
  return {
    slug,
    boardName: 'Education Board',
    shortcode: null,
    format: '[Roll Number]',
    example: 'Roll Number',
    supported: false,
    networkCharges: 'N/A',
    notes: 'SMS result service details will be updated as notified by the board.',
  }
}

export function buildSmsHref(shortcode: string, prefix?: string, rollNumber?: string): string {
  const cleanCode = shortcode.trim()
  const text = (rollNumber || '').trim()
  const fullBody = text ? `${prefix || ''}${text}`.trim() : ''
  if (!fullBody) {
    return `sms:${cleanCode}`
  }
  return `sms:${cleanCode}?body=${encodeURIComponent(fullBody)}`
}
