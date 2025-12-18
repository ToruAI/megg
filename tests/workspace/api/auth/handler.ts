// Simulated auth handler
export async function login(email: string, password: string) {
  // JWT auth logic would go here
  return { token: 'fake-jwt-token' };
}

export async function logout(token: string) {
  // Invalidate token
  return { success: true };
}
