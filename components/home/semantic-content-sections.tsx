import Link from 'next/link'

import {
  BookOpenIcon,
  CheckCircle2Icon,
  FileTextIcon,
  LandmarkIcon,
  ShieldCheckIcon,
  ZapIcon,
} from '@/components/ui/icons'

export function SemanticContentSections() {
  return (
    <div className="relative border-b border-slate-200/80 bg-white py-16 sm:py-20">
      <div className="container-wide">
        <div className="mx-auto max-w-4xl space-y-16 lg:space-y-20">
          {/* ========================================================================= */}
          {/* SECTION 1: WHAT IS 12TH CLASS / 2ND YEAR / HSSC PART-II?                   */}
          {/* ========================================================================= */}
          <article id="about-12th-class" aria-labelledby="heading-what-is-12th">
            <div className="flex items-center gap-2 text-xs font-black tracking-widest text-[#007054] uppercase">
              <span className="flex h-2 w-2 rounded-full bg-[#007054]" />
              <span>ACADEMIC FRAMEWORK &amp; EQUIVALENCE</span>
            </div>

            <h2
              id="heading-what-is-12th"
              className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-[34px] lg:leading-tight"
            >
              What is 12th Class, 2nd Year &amp;{' '}
              <span className="text-[#007054]">HSSC Part-II?</span>
            </h2>

            <div className="mt-4 space-y-4 text-xs leading-relaxed text-slate-700 sm:text-sm md:text-[15px] md:leading-relaxed">
              <p>
                In Pakistan&apos;s national secondary education framework,{' '}
                <strong>12th Class</strong>, <strong>2nd Year</strong>,{' '}
                <strong>Intermediate Part-II</strong>, and{' '}
                <strong>HSSC Part-II (Higher Secondary School Certificate Part-II)</strong> refer to
                the concluding grade of intermediate schooling. Following the 11th Class (First
                Year) examinations, 12th Class represents the definitive academic milestone that
                determines a student&apos;s cumulative intermediate score, division, and eligibility
                for higher education.
              </p>
              <p>
                All 24+ Boards of Intermediate and Secondary Education (BISE) across Punjab, Khyber
                Pakhtunkhwa (KPK), Sindh, Balochistan, Azad Jammu &amp; Kashmir (AJK), and the
                Federal Board (FBISE Islamabad) administer this examination annually across major
                study streams:
              </p>

              {/* Stream Breakdown Cards */}
              <div className="grid grid-cols-1 gap-3 pt-2 sm:grid-cols-2 md:grid-cols-3">
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5">
                  <span className="font-extrabold text-slate-900">FSc Pre-Medical</span>
                  <p className="mt-1 text-xs text-slate-600">
                    Physics, Chemistry, Biology — Mandatory prerequisite for medical colleges
                    (MBBS/BDS) and allied health sciences via MDCAT.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5">
                  <span className="font-extrabold text-slate-900">FSc Pre-Engineering</span>
                  <p className="mt-1 text-xs text-slate-600">
                    Physics, Chemistry, Mathematics — Required gateway for engineering universities,
                    computing programs, and technology institutes via ECAT.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5">
                  <span className="font-extrabold text-slate-900">ICS (Computer Science)</span>
                  <p className="mt-1 text-xs text-slate-600">
                    Computer Science, Mathematics, Physics/Statistics — Standard track for software
                    engineering, BS Computer Science, AI, and IT degrees.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5">
                  <span className="font-extrabold text-slate-900">I.Com (Commerce)</span>
                  <p className="mt-1 text-xs text-slate-600">
                    Accounting, Banking, Commercial Geography — Foundation for BBA, BS Accounting
                    &amp; Finance, CA, ACCA, and business management.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5">
                  <span className="font-extrabold text-slate-900">FA (Humanities / Arts)</span>
                  <p className="mt-1 text-xs text-slate-600">
                    Economics, Political Science, Psychology, Languages — Gateway to Law (LLB),
                    social sciences, public administration, and civil services.
                  </p>
                </div>
                <div className="rounded-xl border border-slate-200/80 bg-slate-50/70 p-3.5">
                  <span className="font-extrabold text-slate-900">General Science</span>
                  <p className="mt-1 text-xs text-slate-600">
                    Mathematics, Statistics, Economics — Preferred preparation for data science,
                    actuarial science, analytics, and economics.
                  </p>
                </div>
              </div>

              <p className="pt-2 text-slate-600">
                Because 12th Class aggregate marks carry decisive weight in university admissions,
                entry test merit lists, and overseas degree equivalencies via IBCC (Inter Board
                Coordination Commission), obtaining authentic, error-free result records is
                essential for every candidate.
              </p>
            </div>
          </article>

          {/* ========================================================================= */}
          {/* SECTION 2: HOW TO CHECK 12TH CLASS RESULT 2026 ACROSS PAKISTAN              */}
          {/* ========================================================================= */}
          <article id="how-to-check" aria-labelledby="heading-how-to-check">
            <div className="flex items-center gap-2 text-xs font-black tracking-widest text-[#007054] uppercase">
              <span className="flex h-2 w-2 rounded-full bg-[#007054]" />
              <span>STEP-BY-STEP EXAMINATION ACCESS</span>
            </div>

            <h2
              id="heading-how-to-check"
              className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-[34px] lg:leading-tight"
            >
              How to Check <span className="text-[#007054]">12th Class Result 2026</span> Across
              Pakistan
            </h2>

            <div className="mt-4 space-y-4 text-xs leading-relaxed text-slate-700 sm:text-sm md:text-[15px] md:leading-relaxed">
              <p>
                Intermediate students in Pakistan can access their 2nd year results through four
                primary channels. Depending on whether your board has published a complete digital
                Gazette or relies on an online database server, use the method best suited to your
                needs:
              </p>

              <div className="space-y-4 pt-2">
                {/* Method 1 */}
                <div className="rounded-2xl border border-slate-200/90 bg-[#F9FBFA] p-4 sm:p-5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#007054] text-xs font-black text-white">
                      1
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Online Roll Number Lookup (Web &amp; Verified Gazette)
                    </h3>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 sm:text-sm">
                    The most rapid and accurate method. Select your respective board (e.g.{' '}
                    <Link
                      href="/results/lahore-board/12th-class"
                      className="font-semibold text-[#007054] underline"
                    >
                      BISE Lahore
                    </Link>{' '}
                    or{' '}
                    <Link
                      href="/results/federal-board/12th-class"
                      className="font-semibold text-[#007054] underline"
                    >
                      FBISE Federal
                    </Link>
                    ), choose the 2026 Annual Examination, and input your official 6-digit roll
                    number. Where a verified board gazette has been ingested on
                    12thClassResult.com.pk, you can retrieve your marks even when the board&apos;s
                    main website is overloaded.
                  </p>
                </div>

                {/* Method 2 */}
                <div className="rounded-2xl border border-slate-200/90 bg-[#F9FBFA] p-4 sm:p-5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#007054] text-xs font-black text-white">
                      2
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Official Board SMS Shortcode Service
                    </h3>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 sm:text-sm">
                    For students in remote areas without stable internet connections on result
                    morning, each intermediate board operates a designated SMS gateway. Type your
                    roll number in an SMS message and send it to your board&apos;s verified SMS code
                    where officially announced. Because shortcode availability varies by telecom
                    carrier and examination cycle, always confirm the designated code directly on
                    your individual board directory page.
                  </p>
                </div>

                {/* Method 3 */}
                <div className="rounded-2xl border border-slate-200/90 bg-[#F9FBFA] p-4 sm:p-5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#007054] text-xs font-black text-white">
                      3
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Downloadable Official Gazette (PDF Archive)
                    </h3>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 sm:text-sm">
                    The Gazette is the official comprehensive document released on CD and PDF format
                    by each board&apos;s Controller of Examinations. It catalogues all candidate
                    roll numbers, student names, subject marks, and pass/fail standings. You can
                    search within the Gazette by pressing{' '}
                    <kbd className="rounded bg-slate-200 px-1 py-0.5 font-mono text-xs text-slate-800">
                      Ctrl + F
                    </kbd>{' '}
                    on desktop or using the PDF viewer search bar on mobile.
                  </p>
                </div>

                {/* Method 4 */}
                <div className="rounded-2xl border border-slate-200/90 bg-[#F9FBFA] p-4 sm:p-5">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#007054] text-xs font-black text-white">
                      4
                    </div>
                    <h3 className="text-base font-extrabold text-slate-900">
                      Official Board Portal &amp; Detailed Marks Certificate (DMC)
                    </h3>
                  </div>
                  <p className="mt-2 text-xs text-slate-600 sm:text-sm">
                    While gazette entries confirm pass/fail marks and grade breakdowns, students who
                    require an authenticated physical DMC or e-result card for university admissions
                    must download it directly from the board&apos;s official portal using the
                    verified direct links provided across our board directories.
                  </p>
                </div>
              </div>
            </div>
          </article>

          {/* ========================================================================= */}
          {/* SECTION 3: HOW GAZETTE LOOKUP & ARCHITECTURE WORKS                         */}
          {/* ========================================================================= */}
          <article id="gazette-architecture" aria-labelledby="heading-gazette-architecture">
            <div className="flex items-center gap-2 text-xs font-black tracking-widest text-[#007054] uppercase">
              <span className="flex h-2 w-2 rounded-full bg-[#007054]" />
              <span>FAILOVER INFRASTRUCTURE &amp; FIDELITY</span>
            </div>

            <h2
              id="heading-gazette-architecture"
              className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-[34px] lg:leading-tight"
            >
              How Verified <span className="text-[#007054]">Gazette Lookup</span> Works
            </h2>

            <div className="mt-4 space-y-4 text-xs leading-relaxed text-slate-700 sm:text-sm md:text-[15px] md:leading-relaxed">
              <p>
                On result announcement morning, over 1.5 million intermediate students
                simultaneously access education board websites across Pakistan. This massive traffic
                surge frequently causes official board servers to crash or become unresponsive for
                hours.
              </p>
              <p>
                <strong>12thClassResult.com.pk</strong> was built with a specialized{' '}
                <em>Gazette-First Architecture</em> designed to solve this exact bottleneck. Here is
                how our verification pipeline operates:
              </p>

              <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-3">
                <div className="rounded-2xl border border-emerald-100 bg-[#EDF8F5] p-4.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#007054] text-white shadow-2xs">
                    <FileTextIcon width={18} height={18} />
                  </div>
                  <h3 className="mt-3 font-extrabold text-slate-900">
                    1. Sealed Gazette Ingestion
                  </h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Official gazette PDFs published by education boards are captured directly upon
                    release and cryptographically verified against board signatures.
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-[#EDF8F5] p-4.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#007054] text-white shadow-2xs">
                    <ZapIcon width={18} height={18} />
                  </div>
                  <h3 className="mt-3 font-extrabold text-slate-900">2. Deterministic Parsing</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    Records are processed into structured index tables without modifying a single
                    character of candidate marks, names, grades, or board remarks.
                  </p>
                </div>

                <div className="rounded-2xl border border-emerald-100 bg-[#EDF8F5] p-4.5">
                  <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#007054] text-white shadow-2xs">
                    <ShieldCheckIcon width={18} height={18} />
                  </div>
                  <h3 className="mt-3 font-extrabold text-slate-900">3. Edge-Cached Delivery</h3>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-600">
                    When official websites crash under load, candidates can query their roll number
                    against our globally distributed edge cache in under 50 milliseconds.
                  </p>
                </div>
              </div>

              <div className="mt-2 rounded-xl border border-slate-200 bg-slate-50 p-3.5 text-xs text-slate-600">
                <strong className="text-slate-900">Privacy &amp; Data Ethics:</strong> We do not ask
                for student phone numbers, CNIC, or passwords. Roll numbers are queried strictly to
                retrieve public examination records published in the official gazette.
              </div>
            </div>
          </article>

          {/* ========================================================================= */}
          {/* SECTION 4: RESULT DATE SCHEDULE & BOARD STATUS 2026                       */}
          {/* ========================================================================= */}
          <article id="date-schedule" aria-labelledby="heading-date-schedule">
            <div className="flex items-center gap-2 text-xs font-black tracking-widest text-[#007054] uppercase">
              <span className="flex h-2 w-2 rounded-full bg-[#007054]" />
              <span>TIMELINE &amp; PROVINCIAL COORDINATION</span>
            </div>

            <h2
              id="heading-date-schedule"
              className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-[34px] lg:leading-tight"
            >
              12th Class Result Date &amp;{' '}
              <span className="text-[#007054]">Board Schedule 2026</span>
            </h2>

            <div className="mt-4 space-y-4 text-xs leading-relaxed text-slate-700 sm:text-sm md:text-[15px] md:leading-relaxed">
              <p>
                A common misconception among students is that all education boards in Pakistan
                announce their 12th class results on the exact same date. In reality, announcement
                dates are determined by provincial coordination committees and board autonomy:
              </p>

              {/* Provincial Coordination Table */}
              <div className="overflow-x-auto rounded-2xl border border-slate-200/90 bg-white shadow-2xs">
                <table className="w-full min-w-[540px] text-left text-xs sm:text-sm">
                  <thead className="border-b border-slate-200 bg-slate-50 font-extrabold text-slate-900">
                    <tr>
                      <th className="p-3.5 sm:p-4">Province / Board Group</th>
                      <th className="p-3.5 sm:p-4">Key Boards Included</th>
                      <th className="p-3.5 sm:p-4">Announcement Protocol</th>
                      <th className="p-3.5 sm:p-4">Expected Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-slate-700">
                    <tr className="hover:bg-slate-50/70">
                      <td className="p-3.5 font-bold text-slate-900 sm:p-4">Punjab Boards</td>
                      <td className="p-3.5 sm:p-4">
                        Lahore, Gujranwala, Rawalpindi, Multan, Faisalabad, Sargodha, Sahiwal,
                        Bahawalpur, DG Khan
                      </td>
                      <td className="p-3.5 sm:p-4">
                        Unified PBCC Decision (Simultaneous 10:00 AM)
                      </td>
                      <td className="p-3.5 font-bold text-[#007054] sm:p-4">
                        Tentative: October 2026
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/70">
                      <td className="p-3.5 font-bold text-slate-900 sm:p-4">
                        Federal Board (FBISE)
                      </td>
                      <td className="p-3.5 sm:p-4">
                        Islamabad, Cantonments, Overseas Pakistan Schools
                      </td>
                      <td className="p-3.5 sm:p-4">Autonomous Federal Ministry Notification</td>
                      <td className="p-3.5 font-bold text-[#007054] sm:p-4">
                        Tentative: August / September 2026
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/70">
                      <td className="p-3.5 font-bold text-slate-900 sm:p-4">KPK Boards</td>
                      <td className="p-3.5 sm:p-4">
                        Peshawar, Abbottabad, Mardan, Swat, Malakand, Kohat, Bannu, DI Khan
                      </td>
                      <td className="p-3.5 sm:p-4">KPK Boards Committee Unified or Staggered</td>
                      <td className="p-3.5 font-bold text-[#007054] sm:p-4">
                        Tentative: September 2026
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/70">
                      <td className="p-3.5 font-bold text-slate-900 sm:p-4">Sindh Boards</td>
                      <td className="p-3.5 sm:p-4">
                        BIEK Karachi, Hyderabad, Sukkur, Larkana, Mirpurkhas, SBA Nawabshah
                      </td>
                      <td className="p-3.5 sm:p-4">
                        Stream-wise (Pre-Medical &amp; Pre-Engineering first)
                      </td>
                      <td className="p-3.5 font-bold text-[#007054] sm:p-4">
                        Tentative: September – October 2026
                      </td>
                    </tr>
                    <tr className="hover:bg-slate-50/70">
                      <td className="p-3.5 font-bold text-slate-900 sm:p-4">Balochistan Board</td>
                      <td className="p-3.5 sm:p-4">BISE Quetta</td>
                      <td className="p-3.5 sm:p-4">Provincial Notification</td>
                      <td className="p-3.5 font-bold text-[#007054] sm:p-4">
                        Tentative: September 2026
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-slate-600">
                We monitor official gazettes and controller press releases continuously. Confirmed
                dates are published strictly with direct citations to official board notifications.
              </p>
            </div>
          </article>

          {/* ========================================================================= */}
          {/* SECTION 5: WHY TRUST OUR RESULT DATA?                                     */}
          {/* ========================================================================= */}
          <article id="why-trust-us" aria-labelledby="heading-why-trust">
            <div className="flex items-center gap-2 text-xs font-black tracking-widest text-[#007054] uppercase">
              <span className="flex h-2 w-2 rounded-full bg-[#007054]" />
              <span>EDITORIAL GOVERNANCE &amp; ACCURACY</span>
            </div>

            <h2
              id="heading-why-trust"
              className="mt-3 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl lg:text-[34px] lg:leading-tight"
            >
              Why Trust Our <span className="text-[#007054]">Result Data?</span>
            </h2>

            <div className="mt-4 space-y-4 text-xs leading-relaxed text-slate-700 sm:text-sm md:text-[15px] md:leading-relaxed">
              <p>
                In an ecosystem often plagued by unverified rumors, speculative result dates, and
                clickbait headlines, <strong>12thClassResult.com.pk</strong> operates under a
                strict, transparent editorial standard:
              </p>

              <div className="grid grid-cols-1 gap-4 pt-2 sm:grid-cols-2">
                <div className="flex gap-3 rounded-2xl border border-slate-200/90 bg-[#F9FBFA] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#007054]">
                    <CheckCircle2Icon width={20} height={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900">Zero Speculation Policy</h3>
                    <p className="mt-1 text-xs text-slate-600">
                      We never publish &ldquo;breaking news&rdquo; about result dates unless
                      substantiated by an official press notification signed by the board&apos;s
                      Controller of Examinations.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-2xl border border-slate-200/90 bg-[#F9FBFA] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#007054]">
                    <ShieldCheckIcon width={20} height={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900">
                      Deterministic Gazette Fidelity
                    </h3>
                    <p className="mt-1 text-xs text-slate-600">
                      When checking a roll number against our local gazette database, the output is
                      an exact cryptographic replica of the board&apos;s physical gazette
                      publication.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-2xl border border-slate-200/90 bg-[#F9FBFA] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#007054]">
                    <LandmarkIcon width={20} height={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900">
                      Transparent Official Fallbacks
                    </h3>
                    <p className="mt-1 text-xs text-slate-600">
                      If a board&apos;s gazette dataset has not yet been processed or verified, we
                      never show fake results; instead, we provide direct, secure links to the
                      official board portal.
                    </p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-2xl border border-slate-200/90 bg-[#F9FBFA] p-4">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-[#007054]">
                    <BookOpenIcon width={20} height={20} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-900">Post-Result Academic Guidance</h3>
                    <p className="mt-1 text-xs text-slate-600">
                      Beyond raw marks, we publish comprehensive verified guides for paper
                      rechecking, marks percentage calculation, second annual improvements, and
                      university entry exams.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-xs">
                <span className="font-medium text-slate-500">
                  Have questions regarding result verification protocols?
                </span>
                <Link
                  href="/methodology"
                  className="font-bold text-[#007054] underline underline-offset-4 hover:text-[#005a43]"
                >
                  Read Our Full Verification Methodology &rarr;
                </Link>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  )
}
