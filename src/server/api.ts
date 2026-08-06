import { handleLeadRequest } from "./leads";

export async function handleApiRequest(
  request: Request,
  env: unknown,
): Promise<Response | undefined> {
  const url = new URL(request.url);

  if (url.pathname === "/api/health") {
    return new Response(JSON.stringify({ status: "ok", timestamp: new Date().toISOString() }), {
      status: 200,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }

  if (url.pathname === "/api/leads") {
    return handleLeadRequest(request, env);
  }

  if (url.pathname.startsWith("/api/")) {
    return new Response(JSON.stringify({ message: "Endpoint nao encontrado." }), {
      status: 404,
      headers: { "content-type": "application/json; charset=utf-8" },
    });
  }

  return undefined;
}
