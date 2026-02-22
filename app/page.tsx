import { Github, Instagram, Facebook } from "lucide-react";
import Link from "next/link";
import { BsDiscord } from "react-icons/bs";
import { SiTypescript, SiGo, SiPostman, SiGit } from "react-icons/si";
async function getRepos() {
  const res = await fetch(
    "https://api.github.com/users/Peera-27/repos?sort=updated&per_page=18",
    {
      // อัปเดตข้อมูลทุกๆ 1 ชั่วโมง (3600 วินาที) เพื่อป้องกันการยิง API ถี่เกินไป
      next: { revalidate: 3600 },
    },
  );

  if (!res.ok) {
    return []; // ถ้าดึงไม่สำเร็จ ให้ส่ง array ว่างกลับไปก่อน หน้าเว็บจะได้ไม่พัง
  }
  return res.json();
}
export default async function Page() {
  const repos = await getRepos();
  return (
    <div className="relative min-h-screen bg-white px-4 py-12 md:py-20 print:bg-transparent text-neutral-900">
      {/* Background Pattern - สวยอยู่แล้ว เก็บไว้เลยครับ */}
      <svg
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 h-full w-full fill-neutral-400/20 stroke-neutral-400/20 mask-[linear-gradient(to_bottom_right,white,transparent,transparent)] opacity-50 print:hidden"
      >
        <defs>
          <pattern
            id="_S_1_"
            width="20"
            height="20"
            patternUnits="userSpaceOnUse"
            x="-1"
            y="-1"
          >
            <path d="M.5 20V.5H20" fill="none" strokeDasharray="0"></path>
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          strokeWidth="0"
          fill="url(#_S_1_)"
        ></rect>
      </svg>

      <section className="relative mx-auto w-full max-w-4xl space-y-12 print:space-y-6">
        {/* --- Profile Section --- */}
        <div className="flex flex-col-reverse md:flex-row items-start md:items-center justify-between gap-6">
          <div className="flex-1 space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-neutral-900">
              Peeraphat Chompoosi{" "}
              <span className="text-neutral-400 font-normal">(Pee)</span>
            </h1>
            <p className="text-neutral-500 leading-relaxed max-w-lg">
              Student at Faculty of Information Technology, Department of
              Computer Science, Year 3
            </p>
            <div className="flex gap-4 pt-2 text-neutral-400">
              <Link
                href="https://github.com/Peera-27"
                className="hover:text-green-500 transition-colors"
              >
                <Github size={22} />
              </Link>
              <Link
                href="https://www.instagram.com/_peezx/"
                className="hover:text-green-500 transition-colors"
              >
                <Instagram size={22} />
              </Link>
              <Link
                href="https://www.facebook.com/peerphat.chompoosi.5/"
                className="hover:text-green-500 transition-colors"
              >
                <Facebook size={22} />
              </Link>
              <Link
                href="https://discord.com/users/857976414183227492"
                className="hover:text-green-500 transition-colors"
              >
                <BsDiscord size={22} />
              </Link>
            </div>
          </div>
          <div className="shrink-0">
            <img
              className="w-28 h-28 md:w-32 md:h-32 rounded-full object-cover ring-4 ring-neutral-50 shadow-lg"
              src="/assets/profile.jpg"
              alt="Peeraphat Chompoosi"
            />
          </div>
        </div>

        {/* --- About Me Section --- */}
        <div className="space-y-3">
          <h2 className="text-xl font-semibold tracking-tight">About me</h2>
          <p className="text-neutral-500 leading-relaxed max-w-3xl">
            I'm a newbie full-stack developer with a passion for learning and
            creating. I wanna be a senior developer in the future. I have
            experience with JavaScript, TypeScript, React, Node.js, and some
            other technologies. I'm always looking for new opportunities to grow
            and improve my skills.
          </p>
        </div>
        <div></div>
        <div className="text-lg font-semibold">skills</div>
        <div className="flex flex-wrap gap-4">
          <div className="inline-flex items-center rounded-md border text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:text-accent-foreground px-2 py-1 hover:border-orange-500 hover:bg-orange-50">
            <SiTypescript className="text-blue-500" />
            <span className="ml-2">TypeScript</span>
          </div>
          <div className="inline-flex items-center rounded-md border text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:text-accent-foreground px-2 py-1 hover:border-orange-500 hover:bg-orange-50">
            <img
              src="https://svgl.app/library/javascript.svg"
              alt="JavaScript"
              className="mr-1 size-3.5"
            />
            <span className="ml-2">JavaScript</span>
          </div>
          <div className="inline-flex items-center rounded-md border text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:text-accent-foreground px-2 py-1 hover:border-orange-500 hover:bg-orange-50">
            <img
              src="https://svgl.app/library/nextjs_icon_dark.svg"
              alt="Next.js"
              className="mr-1 size-3.5"
            />
            <span className="ml-2">Next.js</span>
          </div>
          <div className="inline-flex items-center rounded-md border text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:text-accent-foreground px-2 py-1 hover:border-orange-500 hover:bg-orange-50">
            <img
              src="https://svgl.app/library/tailwindcss.svg"
              alt="Tailwind CSS"
              className="mr-1 size-3.5"
            />
            <span className="ml-2">Tailwind CSS</span>
          </div>
          <div className="inline-flex items-center rounded-md border text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:text-accent-foreground px-2 py-1 hover:border-orange-500 hover:bg-orange-50">
            <SiGo className="text-blue-400" />
            <span className="ml-2">Go</span>
          </div>
          <div className="inline-flex items-center rounded-md border text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:text-accent-foreground px-2 py-1 hover:border-orange-500 hover:bg-orange-50">
            <img
              src="https://svgl.app/library/bun.svg"
              alt="Bun"
              className="mr-1 size-3.5"
            />
            <span className="ml-2">Bun</span>
          </div>
          <div className="inline-flex items-center rounded-md border text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:text-accent-foreground px-2 py-1 hover:border-orange-500 hover:bg-orange-50">
            <SiPostman className="text-orange-400" />
            <span className="ml-2">Postman</span>
          </div>
          <div className="inline-flex items-center rounded-md border text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:text-accent-foreground px-2 py-1 hover:border-orange-500 hover:bg-orange-50">
            <SiGit className="text-orange-500" />
            <span className="ml-2">Git</span>
          </div>
          <div className="inline-flex items-center rounded-md border text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:text-accent-foreground px-2 py-1 hover:border-orange-500 hover:bg-orange-50">
            <img
              src="https://svgl.app/library/figma.svg"
              alt="Figma"
              className="mr-1 size-3.5"
            />
            <span className="ml-2">Figma</span>
          </div>
          <div className="inline-flex items-center rounded-md border text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:text-accent-foreground px-2 py-1 hover:border-orange-500 hover:bg-orange-50">
            <img
              src="https://svgl.app/library/mysql-icon-light.svg"
              alt="MySQL"
              className="mr-1 size-3.5"
            />
            <span className="ml-2">MySQL</span>
          </div>
          <div className="inline-flex items-center rounded-md border text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:text-accent-foreground px-2 py-1 hover:border-orange-500 hover:bg-orange-50">
            <img
              src="https://svgl.app/library/mongodb-icon-dark.svg"
              alt="MongoDB"
              className="mr-1 size-3.5"
            />
            <span className="ml-2">MongoDB</span>
          </div>
          <div className="inline-flex items-center rounded-md border text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:text-accent-foreground px-2 py-1 hover:border-orange-500 hover:bg-orange-50">
            <img
              src="https://svgl.app/library/supabase.svg"
              alt="Supabase"
              className="mr-1 size-3.5"
            />
            <span className="ml-2">Supabase</span>
          </div>
          <div className="inline-flex items-center rounded-md border text-xs font-semibold transition-colors focus:outline-hidden focus:ring-2 focus:ring-ring focus:ring-offset-2 text-foreground hover:text-accent-foreground px-2 py-1 hover:border-orange-500 hover:bg-orange-50">
            <img
              src="https://svgl.app/library/gemini.svg"
              alt="Gemini"
              className="mr-1 size-3.5"
            />
            <span className="ml-2">Gemini</span>
          </div>
        </div>
        <div className="space-y-4 pt-4">
          <h2 className="text-xl font-semibold tracking-tight">Projects</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {repos.map((repo: any) => (
              <a
                key={repo.id}
                href={repo.html_url}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-orange-400 hover:shadow-md"
              >
                <div>
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-neutral-900 group-hover:text-orange-600 transition-colors">
                      {repo.name}
                    </h3>
                    <Github
                      size={18}
                      className="text-neutral-300 group-hover:text-orange-400 transition-colors"
                    />
                  </div>
                  <p className="mt-3 text-sm text-neutral-500 line-clamp-2 leading-relaxed">
                    {repo.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-6 flex items-center gap-4 text-xs font-medium text-neutral-500">
                  {repo.language && (
                    <span className="flex items-center gap-1.5">
                      <span className="h-2 w-2 rounded-full bg-orange-400"></span>
                      {repo.language}
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    ⭐ {repo.stargazers_count}
                  </span>
                  <span className="flex items-center gap-1">
                    🍴 {repo.forks_count}
                  </span>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
