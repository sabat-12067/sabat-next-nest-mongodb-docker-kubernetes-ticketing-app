export async function GET(request: Request) {
  return Response.json({ status: 'ok', message: 'Hello, from API!' });
}
