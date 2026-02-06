/**
 * Frontend configuration loaded from environment variables.
 */

/** Maximum characters allowed in a chat message */
export const MAX_MESSAGE_LENGTH = 500;

interface Config {
  apiUrl: string;
}

export const config: Config = {
  apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000",
};
