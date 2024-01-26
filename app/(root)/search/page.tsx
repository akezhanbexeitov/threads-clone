import UserCard from "@/components/cards/UserCard";
import SearchBar from "@/components/shared/Search";
import { fetchUser, fetchUsers } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import { redirect } from "next/navigation";

interface Params {
  searchParams: { [key: string]: string | undefined };
}

export default async function Page({ searchParams }: Params) {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const { users } = await fetchUsers({
    userId: user.id,
    searchString: searchParams.q,
    pageNumber: searchParams?.page ? +searchParams.page : 1,
    pageSize: 25,
  });

  return (
    <section>
      <h1 className="head-text mb-4 md:mb-10">Search</h1>

      <SearchBar routeType="search" />

      <div className="mt-4 flex flex-col gap-9 md:mt-14">
        {users.length === 0 ? (
          <p className="no-result">No users found</p>
        ) : (
          <>
            {users.map((person) => (
              <UserCard
                key={person.id}
                id={person.id}
                name={person.name}
                username={person.username}
                imgUrl={person.image}
                personType="User"
              />
            ))}
          </>
        )}
      </div>
    </section>
  );
}
