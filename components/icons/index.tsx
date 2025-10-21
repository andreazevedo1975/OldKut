
import React from 'react';

const iconProps = {
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    strokeWidth: 1.5,
    stroke: "currentColor",
};

export const SearchIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
);

export const PaletteIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M4.098 19.902a3.75 3.75 0 005.304 0l6.402-6.402M18.75 7.5V5.25A2.25 2.25 0 0016.5 3h-9A2.25 2.25 0 005.25 5.25v9A2.25 2.25 0 007.5 16.5h3.75m.75-12v3.375c0 .621.504 1.125 1.125 1.125h3.375m-1.5-4.5L18 7.5m-1.5-4.5l-3.375 3.375" />
    </svg>
);

export const StarIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} fill="currentColor" className={className}>
        <path fillRule="evenodd" d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.007z" clipRule="evenodd" />
    </svg>
);

export const CameraIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.776 48.776 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0zM18.75 10.5h.008v.008h-.008V10.5z" />
    </svg>
);

export const VideoIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5l4.72-4.72a.75.75 0 011.28.53v11.38a.75.75 0 01-1.28.53l-4.72-4.72M4.5 18.75h9a2.25 2.25 0 002.25-2.25v-9A2.25 2.25 0 0013.5 5.25h-9A2.25 2.25 0 002.25 7.5v9A2.25 2.25 0 004.5 18.75z" />
    </svg>
);

export const MessageIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 011.037-.443 48.282 48.282 0 005.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
);

export const UserIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className} strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
    </svg>
);

export const GroupIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m-7.5-2.962c.57-1.037 1.25-2.028 2.01-2.905 1.552-1.784 3.473-3.155 5.59-4.141m-6.386 9.652c-1.33.645-2.831 1.01-4.463 1.01-1.633 0-3.133-.365-4.463-1.01M12 19.588c-1.33.645-2.831 1.01-4.463 1.01-1.633 0-3.133-.365-4.463-1.01M12 19.588V12.75m0 6.838c1.633-.645 3.133-1.01 4.463-1.01 1.633 0 3.133.365 4.463 1.01m-8.926-6.838c1.33-.645 2.831-1.01 4.463-1.01 1.633 0 3.133.365 4.463 1.01" />
    </svg>
);

export const NewspaperIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V7.5a2.25 2.25 0 012.25-2.25h1.5M12 14.25h.008v.008H12v-.008z" />
    </svg>
);

export const HeartIcon: React.FC<{ className?: string, filled?: boolean }> = ({ className, filled }) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill={filled ? "currentColor" : "none"} className={className}>
        <path stroke={filled ? 'none' : 'currentColor'} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
    </svg>
);

export const CheckCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const XCircleIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);

export const MinusIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
    </svg>
);

export const XIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const SubtitleIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.761 9.761 0 01-2.542-.381 1.483 1.483 0 00-.97-.07L3 18.75l1.555-3.57a1.483 1.483 0 00-.07-.97 9.761 9.761 0 01-.381-2.542C4.125 7.444 8.155 3.75 13.125 3.75c4.97 0 9 3.686 9 8.25z" />
  </svg>
);

export const ImageIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
  </svg>
);

export const EyeIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
    </svg>
);

export const SettingsIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg {...iconProps} className={className}>
    <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-1.008 1.11-1.226.55-.218 1.192-.218 1.742 0 .55.218 1.02.684 1.11 1.226.09.542-.03 1.122-.39 1.586l-.01.01c-.36.464-.9.76-1.47.864a2.1 2.1 0 01-1.15 0c-.57-.104-1.11-.4-1.47-.864l-.01-.01c-.36-.464-.48-1.044-.39-1.586zM19.5 9.75l.408.24a2.1 2.1 0 01-.02 3.518l-.408.24a2.1 2.1 0 01-2.48-.918l-.136-.31a2.1 2.1 0 01.02-2.18l.136-.31a2.1 2.1 0 012.48-.918zM19.5 15.75l.408.24a2.1 2.1 0 01-.02 3.518l-.408.24a2.1 2.1 0 01-2.48-.918l-.136-.31a2.1 2.1 0 01.02-2.18l.136-.31a2.1 2.1 0 012.48-.918zM4.5 9.75l-.408.24a2.1 2.1 0 00.02 3.518l.408.24a2.1 2.1 0 002.48-.918l.136-.31a2.1 2.1 0 00-.02-2.18l-.136-.31a2.1 2.1 0 00-2.48-.918zM4.5 15.75l-.408.24a2.1 2.1 0 00.02 3.518l.408.24a2.1 2.1 0 002.48-.918l.136-.31a2.1 2.1 0 00-.02-2.18l-.136-.31a2.1 2.1 0 00-2.48-.918z" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9a3 3 0 100 6 3 3 0 000-6z" />
  </svg>
);

export const SparklesIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg {...iconProps} className={className}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 00-2.456 2.456zM18 15.75l.259 1.035a3.375 3.375 0 002.456 2.456L21.75 18l-1.035.259a3.375 3.375 0 00-2.456 2.456L18 21.75l-.259-1.035a3.375 3.375 0 00-2.456-2.456L14.25 18l1.035-.259a3.375 3.375 0 002.456-2.456z" />
    </svg>
);
