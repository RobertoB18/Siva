import { NextResponse } from "next/server";
import Facturapi from "facturapi";

const facturapi = new Facturapi(process.env.FACTUAPI_KEY);

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get("q");

  try {
      const searchResult = await facturapi.catalogs.searchUnits({
        q: String(query),
      });

      return NextResponse.json(searchResult);
    } catch (error) {
      console.log("Error en la respuesta de la API:", error.message);
      return NextResponse.json([], {status:500});
    }
}
