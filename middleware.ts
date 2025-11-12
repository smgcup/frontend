import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
	const ua = req.headers.get('user-agent') ?? '';
	const isMobile = /Mobi|Android/i.test(ua);
	const res = NextResponse.next();
	res.cookies.set('device', isMobile ? 'mobile' : 'desktop');
	return res;
}
