// import prisma from "@/app/libs/prismadb";

export default async function getListings() {
  // DB connection commented out — returning mock empty array for UI preview
  // try {
  //   const listings = await prisma.listing.findMany({
  //     orderBy: {
  //       createdAt: 'desc'
  //     }
  //   });
  //   return listings;
  // } catch (error: any) {
  //   throw new Error(error);
  // }

  return [];
}