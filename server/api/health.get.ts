/**
 * Health check endpoint for Cloud Run
 * Returns 200 OK when the application is running properly
 */
export default defineEventHandler(async (event) => {
  try {
    // Basic health checks
    const health = {
      status: 'healthy',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      version: process.env.npm_package_version || 'unknown',
      environment: process.env.NODE_ENV || 'development',
    };

    // Set appropriate headers
    setHeader(event, 'Content-Type', 'application/json');
    setHeader(event, 'Cache-Control', 'no-cache, no-store, must-revalidate');
    
    return health;
  } catch (error) {
    // If there's an error, return 500
    setResponseStatus(event, 500);
    return {
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
});