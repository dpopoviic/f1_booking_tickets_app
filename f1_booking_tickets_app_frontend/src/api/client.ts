const BOOKING_API_URL =
  import.meta.env.VITE_BOOKING_API_URL ||
  import.meta.env.VITE_API_URL ||
  'http://localhost:5005'

const PORTAL_API_URL =
  import.meta.env.VITE_PORTAL_API_URL ||
  'http://localhost:5200'

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message)
    this.name = 'ApiError'
  }
}

async function handleResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text()
    throw new ApiError(response.status, errorText || `HTTP Error ${response.status}`)
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T
  }

  return response.json()
}

function createApiClient(baseUrl: string) {
  return {
    get: async <T>(endpoint: string): Promise<T> => {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return handleResponse<T>(response)
    },

    post: async <T>(endpoint: string, data?: unknown): Promise<T> => {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: data ? JSON.stringify(data) : undefined,
      })
      return handleResponse<T>(response)
    },

    put: async <T>(endpoint: string, data: unknown): Promise<T> => {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      })
      return handleResponse<T>(response)
    },

    delete: async <T>(endpoint: string): Promise<T> => {
      const response = await fetch(`${baseUrl}${endpoint}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return handleResponse<T>(response)
    },
  }
}

export const bookingApi = createApiClient(BOOKING_API_URL)
export const portalApi = createApiClient(PORTAL_API_URL)

// Backward compatibility for existing booking services.
export const api = bookingApi
