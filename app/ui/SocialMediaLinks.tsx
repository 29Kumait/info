import { FC } from 'react';
import { FaGithub, FaLinkedin } from 'react-icons/fa';
import { FaDownload } from 'react-icons/fa6';

interface SocialMediaIconProps {
    href: string;
    label: string;
    icon: JSX.Element;
    download?: boolean;
}

const SocialMediaIcon: FC<SocialMediaIconProps> = ({ href, label, icon, download }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="inline-flex items-center p-4 rounded-lg hover:bg-gray-100 hover:shadow-lg transition sm:p-2"
        {...(download && { download: true })}
    >
        {icon}
        <span className="ml-2 hidden sm:inline">{label}</span>
    </a>
);

export const SocialMediaLinks: FC = () => (
    <div className="flex space-x-4 flex-wrap justify-center sm:space-x-2">
        <SocialMediaIcon
            href="https://github.com/29Kumait"
            label="GitHub"
            icon={<FaGithub size={24} />}
        />
        <SocialMediaIcon
            href="https://linkedin.com/in/kumait"
            label="LinkedIn"
            icon={<FaLinkedin size={24} />}
        />
        <SocialMediaIcon
            href="/download"
            label="Download CV"
            icon={<FaDownload size={24} />}
            download
        />
    </div>
);
