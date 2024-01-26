import { fetchUser, getNotifications } from "@/lib/actions/user.actions";
import { currentUser } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function Page() {
  const user = await currentUser();
  if (!user) return null;

  const userInfo = await fetchUser(user.id);
  if (!userInfo?.onboarded) redirect("/onboarding");

  const notifications = await getNotifications(userInfo._id);

  return (
    <section>
      <h1 className="head-text mb-10">Activity</h1>

      <section className="mt-10 flex flex-col gap-5">
        {notifications.length > 0 ? (
          <>
            {notifications.map((notification) => (
              <Link
                key={notification._id}
                href={`/thread/${notification.parentId}`}
              >
                <article className="activity-card">
                  <div className="h-5 w-5 overflow-hidden rounded-full">
                    <Image
                      src={notification.author.image}
                      alt="Profile picture"
                      width={20}
                      height={20}
                      className="h-full w-full object-cover"
                    />
                  </div>

                  <p className="!text-small-regular text-light-1">
                    <span className="mr-1 text-primary-500">
                      {notification.author.name}
                    </span>{" "}
                    replied to your thread
                  </p>
                </article>
              </Link>
            ))}
          </>
        ) : (
          <p className="no-result">No notifications yet</p>
        )}
      </section>
    </section>
  );
}
