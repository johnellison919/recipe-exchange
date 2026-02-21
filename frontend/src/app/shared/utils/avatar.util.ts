const AVATAR_COLORS = [
  '#E53935', '#D81B60', '#8E24AA', '#5E35B1',
  '#3949AB', '#1E88E5', '#039BE5', '#00ACC1',
  '#00897B', '#43A047', '#7CB342', '#F4511E',
];

function hashUsername(username: string): number {
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

export function generateLetterAvatar(username: string): string {
  const letter = (username?.charAt(0) || '?').toUpperCase();
  const color = AVATAR_COLORS[hashUsername(username) % AVATAR_COLORS.length];
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150">
    <rect width="150" height="150" rx="75" fill="${color}"/>
    <text x="75" y="75" dy=".35em" text-anchor="middle"
      font-family="Arial,sans-serif" font-size="72" font-weight="bold" fill="white">
      ${letter}
    </text>
  </svg>`;
  return `data:image/svg+xml;base64,${btoa(svg)}`;
}

export function getAvatarUrl(avatarUrl: string | null | undefined, username: string): string {
  return avatarUrl || generateLetterAvatar(username);
}
