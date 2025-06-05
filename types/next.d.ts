import { NextRequest, NextResponse } from 'next/server'

declare module 'next/server' {
  interface NextRequest {
    nextUrl: URL
  }
}