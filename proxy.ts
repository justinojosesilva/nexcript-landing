import { NextResponse, type NextRequest } from "next/server";
import { internalAuthConfigured, isAuthorized } from "@/lib/internal/auth";

/** Área interna (/interno) protegida por usuário e senha (HTTP Basic). */
export function proxy(request: NextRequest) {
  if (!internalAuthConfigured()) {
    return new NextResponse("Área interna não configurada.", { status: 503 });
  }
  if (isAuthorized(request.headers.get("authorization"))) {
    const response = NextResponse.next();
    response.headers.set("X-Robots-Tag", "noindex, nofollow");
    return response;
  }
  return new NextResponse("Acesso restrito.", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Nexcript interno", charset="UTF-8"' },
  });
}

export const config = {
  matcher: "/interno/:path*",
};
