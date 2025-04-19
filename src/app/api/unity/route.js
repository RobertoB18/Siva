import { NextResponse } from "next/server";
import Facturapi from "facturapi";

const facturapi = new Facturapi("sk_test_AKEM98JwP6ebLZWqRZVdwBOd3PRgr7loQ0OdyBxm4Y");

export async function GET(request) {
    console.log(request.url);
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    console.log(query);

    try {
        const searchResult = await facturapi.catalogs.searchUnits({
          q: String(query),
        });

        return NextResponse.json(searchResult);
      } catch (error) {
        console.log("Error en la respuesta de la API:", error.message);
        return NextResponse.json("Error");
      }
}
