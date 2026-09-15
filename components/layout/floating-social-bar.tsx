'use client'

import { useState } from 'react'
import {
  FacebookIcon,
  InstagramIcon,
  LinkedInIcon,
  MailIcon,
  PinterestIcon,
  RobotIcon,
  TikTokIcon,
  TwitterXIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from '@/components/ui/icons'

export function FloatingSocialBar() {
  const [activeHover, setActiveHover] = useState<string | null>(null)

  const handleOpenChatbot = (e: React.MouseEvent) => {
    e.preventDefault()
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('toggle-ai-chatbot', { detail: { open: true } }))
    }
  }

  const items = [
    {
      id: 'chatbot',
      label: 'Digital Chatbot',
      subtitle: 'Ask Questions · 24/7 AI',
      color: 'bg-[#00A2B8]',
      icon: RobotIcon,
      onClick: handleOpenChatbot,
      isButton: true,
    },
    {
      id: 'whatsapp',
      label: 'WhatsApp',
      subtitle: 'Join Result Alerts',
      color: 'bg-[#25D366]',
      icon: WhatsAppIcon,
      href: 'https://whatsapp.com/channel/0029Vaexample',
    },
    {
      id: 'facebook',
      label: 'Facebook',
      subtitle: 'Follow Official Page',
      color: 'bg-[#1877F2]',
      icon: FacebookIcon,
      href: 'https://www.facebook.com/12thclassresult.com.pk',
    },
    {
      id: 'youtube',
      label: 'YouTube',
      subtitle: 'Watch Videos',
      color: 'bg-[#FF0000]',
      icon: YouTubeIcon,
      href: 'https://www.youtube.com/@12thclassresult',
    },
    {
      id: 'linkedin',
      label: 'LinkedIn',
      subtitle: 'Connect With Us',
      color: 'bg-[#0A66C2]',
      icon: LinkedInIcon,
      href: 'https://www.linkedin.com/company/12thclassresult',
    },
    {
      id: 'x',
      label: 'X (Twitter)',
      subtitle: 'Latest Announcements',
      color: 'bg-[#000000]',
      icon: TwitterXIcon,
      href: 'https://x.com/12thclassresult',
    },
    {
      id: 'instagram',
      label: 'Instagram',
      subtitle: 'Stories & Updates',
      color: 'bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF]',
      icon: InstagramIcon,
      href: 'https://www.instagram.com/12thclassresult/',
    },
    {
      id: 'tiktok',
      label: 'TikTok',
      subtitle: 'Short Videos & News',
      color: 'bg-[#010101]',
      icon: TikTokIcon,
      href: 'https://www.tiktok.com/@12thclassresult',
    },
    {
      id: 'pinterest',
      label: 'Pinterest',
      subtitle: 'Pins & Updates',
      color: 'bg-[#E60023]',
      icon: PinterestIcon,
      href: 'https://www.pinterest.com/12thclassresult/',
    },
    {
      id: 'contact',
      label: 'Contact Us',
      subtitle: 'Support & Help',
      color: 'bg-[#FF7A00]',
      icon: MailIcon,
      href: 'mailto:info@12thclassresult.com.pk',
    },
  ]

  return (
    <>
      {/* ── Right-Edge Sliding Social Bar (BISE Lahore Style) ── */}
      <aside
        aria-label="Social Media & Support Links"
        className="fixed top-1/2 right-0 z-40 hidden -translate-y-1/2 flex-col items-end gap-1.5 md:flex"
      >
        {items.map((item) => {
          const Icon = item.icon
          const isHovered = activeHover === item.id

          const content = (
            <div
              className={`flex items-center justify-between overflow-hidden shadow-lg transition-all duration-300 ease-out ${item.color} rounded-l-2xl text-white ${
                isHovered ? 'w-52 pr-2.5 pl-3.5' : 'w-11 justify-center px-0'
              } h-11 cursor-pointer`}
            >
              {/* Slide-out text details on hover */}
              <div
                className={`flex flex-col text-left transition-opacity duration-200 ${
                  isHovered ? 'opacity-100' : 'pointer-events-none hidden opacity-0'
                }`}
              >
                <span className="text-xs leading-tight font-bold tracking-wide text-white">
                  {item.label}
                </span>
                <span className="text-[10px] leading-tight font-medium whitespace-nowrap text-white/85">
                  {item.subtitle}
                </span>
              </div>

              {/* Brand Icon */}
              <div className="flex h-11 w-11 shrink-0 items-center justify-center">
                <Icon width={20} height={20} />
              </div>
            </div>
          )

          if (item.isButton) {
            return (
              <button
                key={item.id}
                type="button"
                onClick={item.onClick}
                onMouseEnter={() => setActiveHover(item.id)}
                onMouseLeave={() => setActiveHover(null)}
                aria-label={item.label}
                className="outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
              >
                {content}
              </button>
            )
          }

          return (
            <a
              key={item.id}
              href={item.href}
              target={item.href?.startsWith('mailto:') ? undefined : '_blank'}
              rel={item.href?.startsWith('mailto:') ? undefined : 'noopener noreferrer'}
              onMouseEnter={() => setActiveHover(item.id)}
              onMouseLeave={() => setActiveHover(null)}
              aria-label={item.label}
              className="outline-none focus-visible:ring-2 focus-visible:ring-cyan-400"
            >
              {content}
            </a>
          )
        })}
      </aside>

      {/* ── Mobile Floating Quick Bar (Bottom Right & Left) ── */}
      <div className="fixed bottom-4 left-4 z-40 flex items-center gap-2 md:hidden">
        <a
          href="https://whatsapp.com/channel/0029Vaexample"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Join WhatsApp Result Alerts"
          className="flex h-11 w-11 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl ring-2 ring-white transition-transform active:scale-95"
        >
          <WhatsAppIcon width={22} height={22} />
        </a>
      </div>
    </>
  )
}
