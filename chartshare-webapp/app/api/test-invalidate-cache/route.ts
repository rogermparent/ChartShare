import { closeDb, openDb } from "chartshare-common/db/index";
import { revalidatePath } from "next/cache";

export async function GET(request: Request) {
  if (!process.env.TEST_MODE) {
    return Response.json({ error: "Not available" }, { status: 404 });
  }

  const { searchParams } = new URL(request.url);
  const action = searchParams.get("action");

  if (action === "close") {
    closeDb();
    return Response.json({ closed: true }, { status: 200 });
  }

  openDb();
  revalidatePath("/", "layout");
  return Response.json({ revalidated: true }, { status: 200 });
}
