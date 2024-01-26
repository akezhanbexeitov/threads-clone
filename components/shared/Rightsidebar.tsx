import { getSuggestedUsers } from "@/lib/actions/user.actions";
import UserCard from "../cards/UserCard";

async function RightSideBar() {
  const users = await getSuggestedUsers();

  return (
    <section className="custom-scrollbar rightsidebar">
      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">
          Suggested Communities
        </h3>
      </div>

      <div className="flex flex-1 flex-col justify-start">
        <h3 className="text-heading4-medium text-light-1">Suggested Users</h3>

        <div className="mt-4 flex flex-col gap-4">
          {users.length === 0 ? (
            <p className="no-result">No suggested users</p>
          ) : (
            users.map((user) => (
              <UserCard
                key={user.id}
                id={user.id}
                name={user.name}
                username={user.username}
                imgUrl={user.image}
                personType="User"
              />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

export default RightSideBar;
