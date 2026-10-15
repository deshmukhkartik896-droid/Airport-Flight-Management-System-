import type { FC } from 'react'
import { getAirlineInfo } from '../data/airlines'

interface AirlineLogoProps {
  airline: string
  size?: number | 'sm' | 'md' | 'lg'
  showName?: boolean
  showBadge?: boolean
  className?: string
}

export const AirlineLogo: FC<AirlineLogoProps> = ({
  airline,
  size = 'md',
  showName = false,
  showBadge = false,
  className = '',
}) => {
  const info = getAirlineInfo(airline)
  const pixelSize = typeof size === 'number' ? size : size === 'sm' ? 22 : size === 'lg' ? 44 : 30

  const renderIcon = () => {
    switch (info.name) {
      case 'IndiGo':
        return (
          <svg viewBox="0 0 100 100" width={pixelSize} height={pixelSize} className="airline-svg">
            <rect width="100" height="100" rx="20" fill="#002B7F" />
            {/* Indigo dotted chevron flight pattern */}
            <circle cx="28" cy="72" r="6" fill="#0085FF" />
            <circle cx="44" cy="56" r="6" fill="#3EC6FF" />
            <circle cx="60" cy="40" r="6" fill="#75D5FF" />
            <circle cx="76" cy="24" r="7" fill="#FFFFFF" />
            {/* Modern stylized 6E text */}
            <path
              d="M26 36 L48 36 L48 48 L32 48 L32 60 L48 60"
              stroke="#FFFFFF"
              strokeWidth="5"
              strokeLinecap="round"
              fill="none"
            />
            <path
              d="M72 44 C72 38 66 34 58 34 C50 34 44 42 44 52 C44 62 50 68 60 68 C68 68 72 62 72 56 L58 56"
              stroke="#0085FF"
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
            />
          </svg>
        )

      case 'Air India':
        return (
          <svg viewBox="0 0 100 100" width={pixelSize} height={pixelSize} className="airline-svg">
            <rect width="100" height="100" rx="20" fill="#D71921" />
            {/* Sunburst Chakra ring */}
            <circle cx="50" cy="50" r="36" fill="none" stroke="#F7941D" strokeWidth="3" strokeDasharray="4 3" />
            {/* Centered soaring flying swan / chakra */}
            <path
              d="M24 64 C36 48 48 36 78 28 C64 42 56 52 48 68 C44 58 38 60 24 64 Z"
              fill="#FFFFFF"
            />
            <circle cx="68" cy="34" r="5" fill="#F7941D" />
            {/* AI badge */}
            <text x="50" y="86" textAnchor="middle" fill="#FFFFFF" fontSize="18" fontWeight="900" letterSpacing="1">
              AI
            </text>
          </svg>
        )

      case 'Singapore Airlines':
        return (
          <svg viewBox="0 0 100 100" width={pixelSize} height={pixelSize} className="airline-svg">
            <rect width="100" height="100" rx="20" fill="#00266B" />
            {/* Imperial Kris bird gold emblem */}
            <path
              d="M22 68 L36 34 L78 22 C64 36 54 44 46 54 L44 66 L36 58 L28 68 Z"
              fill="#CBA052"
            />
            <path
              d="M48 28 L72 32 L58 44 Z"
              fill="#E5C77A"
            />
            {/* Wing accent lines */}
            <path d="M42 42 L66 36" stroke="#00266B" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M38 52 L56 46" stroke="#00266B" strokeWidth="2.5" strokeLinecap="round" />
            <text x="50" y="88" textAnchor="middle" fill="#CBA052" fontSize="16" fontWeight="800">
              SQ
            </text>
          </svg>
        )

      case 'Emirates':
        return (
          <svg viewBox="0 0 100 100" width={pixelSize} height={pixelSize} className="airline-svg">
            <rect width="100" height="100" rx="20" fill="#D71920" />
            {/* Gold border */}
            <rect x="6" y="6" width="88" height="88" rx="16" fill="none" stroke="#B38B4D" strokeWidth="2" />
            {/* Emirates Arabic calligraphy inspired crest */}
            <path
              d="M22 46 C28 32 40 28 50 34 C60 40 70 32 78 36 C76 50 64 62 50 58 C38 54 30 64 22 46 Z"
              fill="#FFFFFF"
            />
            <path
              d="M32 50 C40 44 60 44 68 50 C62 58 38 58 32 50 Z"
              fill="#B38B4D"
            />
            <text x="50" y="82" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="900" letterSpacing="1.5">
              EMIRATES
            </text>
          </svg>
        )

      case 'Qatar Airways':
        return (
          <svg viewBox="0 0 100 100" width={pixelSize} height={pixelSize} className="airline-svg">
            <rect width="100" height="100" rx="20" fill="#5C0632" />
            {/* Elegant Arabian Oryx head silhouette */}
            <path
              d="M48 76 C42 66 38 52 42 42 C44 36 48 30 52 24 L56 22 L54 34 C60 38 66 44 66 54 C66 64 58 72 48 76 Z"
              fill="#FFFFFF"
            />
            {/* Oryx long horns */}
            <path d="M50 28 L72 14" stroke="#A37A58" strokeWidth="4" strokeLinecap="round" />
            <path d="M54 26 L78 20" stroke="#FFFFFF" strokeWidth="3.5" strokeLinecap="round" />
            <circle cx="48" cy="46" r="3" fill="#5C0632" />
            <text x="50" y="90" textAnchor="middle" fill="#A37A58" fontSize="16" fontWeight="800">
              QR
            </text>
          </svg>
        )

      case 'Qantas':
        return (
          <svg viewBox="0 0 100 100" width={pixelSize} height={pixelSize} className="airline-svg">
            <rect width="100" height="100" rx="20" fill="#E0001A" />
            {/* White leaping kangaroo tail fin emblem */}
            <path
              d="M24 72 C32 68 38 62 42 54 L52 50 L64 36 C66 32 70 30 74 32 C78 34 78 40 72 46 L60 56 L62 66 L68 70 L58 74 L46 64 C38 68 30 72 24 72 Z"
              fill="#FFFFFF"
            />
            {/* Kangaroo ears and snout */}
            <path d="M72 32 L78 26 L74 34 Z" fill="#FFFFFF" />
            <text x="50" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="16" fontWeight="900" letterSpacing="1">
              QF
            </text>
          </svg>
        )

      case 'Vistara':
        return (
          <svg viewBox="0 0 100 100" width={pixelSize} height={pixelSize} className="airline-svg">
            <rect width="100" height="100" rx="20" fill="#4B1238" />
            {/* Eight-pointed gold Yantra star */}
            <g transform="translate(50, 46)">
              <polygon points="0,-24 7,-8 23,-8 11,2 16,18 0,8 -16,18 -11,2 -23,-8 -7,-8" fill="#C29B38" />
              <circle cx="0" cy="0" r="5" fill="#4B1238" />
            </g>
            <text x="50" y="85" textAnchor="middle" fill="#C29B38" fontSize="15" fontWeight="800" letterSpacing="1">
              VISTARA
            </text>
          </svg>
        )

      case 'Lufthansa':
        return (
          <svg viewBox="0 0 100 100" width={pixelSize} height={pixelSize} className="airline-svg">
            <rect width="100" height="100" rx="20" fill="#05164D" />
            <circle cx="50" cy="50" r="38" fill="none" stroke="#FFAC00" strokeWidth="4" />
            {/* Flying crane silhouette */}
            <path
              d="M26 58 C36 44 48 38 72 32 C62 44 54 50 44 58 L38 52 Z"
              fill="#FFAC00"
            />
            <path d="M48 40 L64 26 L56 42 Z" fill="#FFAC00" />
            <text x="50" y="88" textAnchor="middle" fill="#FFFFFF" fontSize="15" fontWeight="800">
              LH
            </text>
          </svg>
        )

      default:
        return (
          <svg viewBox="0 0 100 100" width={pixelSize} height={pixelSize} className="airline-svg">
            <rect width="100" height="100" rx="20" fill={info.primaryColor} />
            <circle cx="50" cy="50" r="32" fill="none" stroke={info.secondaryColor} strokeWidth="3" />
            <text x="50" y="58" textAnchor="middle" fill="#FFFFFF" fontSize="26" fontWeight="800">
              {info.iata}
            </text>
          </svg>
        )
    }
  }

  return (
    <div className={`airline-badge-wrap ${className}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
      <div className="airline-logo-box" title={`${info.name} (${info.iata})`}>
        {renderIcon()}
      </div>
      {showName && (
        <div className="airline-meta" style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <span className="airline-name-text" style={{ fontWeight: 600, fontSize: pixelSize > 30 ? 14 : 13 }}>
            {info.name}
          </span>
          {showBadge && (
            <span
              className="airline-code-sub"
              style={{ fontSize: 11, color: 'var(--muted)', display: 'flex', gap: 4, alignItems: 'center' }}
            >
              <span
                style={{
                  display: 'inline-block',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  backgroundColor: info.secondaryColor,
                }}
              />
              {info.iata} · {info.country}
            </span>
          )}
        </div>
      )}
    </div>
  )
}
