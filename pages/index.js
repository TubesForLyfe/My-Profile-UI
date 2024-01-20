import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import custom from "../styles/custom.module.css";
import "bootstrap/dist/css/bootstrap.css";

import { useState, useEffect } from "react";
import axios from "axios";
import Select from "react-select";
import { WorkExperience } from "../attributes/WorkExperience";
import { Project } from "../attributes/Project";

export default function Home() {
  const [allWorkExperiences, setAllWorkExperiences] = useState(WorkExperience);
  const [workExperiences, setWorkExperiences] = useState([]);
  const [allProjects, setAllProjects] = useState(Project);
  const [filterProjects, setFilterProjects] = useState([]);
  const [projects, setProjects] = useState([]);
  const [workExperiencePage, setWorkExperiencePage] = useState(1);
  const [lastWorkExperiencePage, setLastWorkExperiencePage] = useState(1);
  const [projectPage, setProjectPage] = useState(1);
  const [lastProjectPage, setLastProjectPage] = useState(1);
  const workExperiencePerPage = 2;
  const projectPerPage = 6;

  useEffect(() => {
    getWorkExperiences();
    getProjects();
  }, []);

  useEffect(() => {
    updateWorkExperienceHTML();
  }, [workExperiences]);

  useEffect(() => {
    updateProjectHTML();
  }, [projects]);

  const updateWorkExperienceHTML = async () => {
    for (let i = 0; i < workExperiences.length; i++) {
      document.getElementById(`work-experience_${i}`).innerHTML =
        workExperiences[i].description;
    }
  };

  const updateProjectHTML = async () => {
    for (let i = 0; i < projects.length; i++) {
      document.getElementById(`project_${i}`).innerHTML =
        projects[i].description;
    }
  };

  const getWorkExperiences = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_PROFILE_API}/work-experience`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_KEY}`,
        },
      })
      .then((response) => {
        setAllWorkExperiences(response.data);
        setLastWorkExperiencePage(
          parseInt((response.data.length - 1) / workExperiencePerPage) + 1
        );
        let workExperience = [];
        for (
          let i = 0;
          i < min(workExperiencePerPage, response.data.length);
          i++
        ) {
          workExperience.push(response.data[i]);
        }
        setWorkExperiences(workExperience);
      })
      .catch((e) => {
        setLastWorkExperiencePage(
          parseInt((allWorkExperiences.length - 1) / workExperiencePerPage) + 1
        );
        let workExperience = [];
        for (
          let i = 0;
          i < min(workExperiencePerPage, allWorkExperiences.length);
          i++
        ) {
          workExperience.push(allWorkExperiences[i]);
        }
        setWorkExperiences(workExperience);
      });
  };

  const firstWorkExperienceClick = () => {
    if (workExperiencePage > 1) {
      setWorkExperiencePage(1);
      const last = 1;
      let workExperience = [];
      for (
        let i = (last - 1) * workExperiencePerPage;
        i < min(allWorkExperiences.length, last * workExperiencePerPage);
        i++
      ) {
        workExperience[workExperience.length] = allWorkExperiences[i];
      }
      setWorkExperiences(workExperience);
    }
  };

  const prevWorkExperienceClick = () => {
    if (workExperiencePage > 1) {
      setWorkExperiencePage(workExperiencePage - 1);
      const next = workExperiencePage - 1;
      let workExperience = [];
      for (
        let i = (next - 1) * workExperiencePerPage;
        i < min(allWorkExperiences.length, next * workExperiencePerPage);
        i++
      ) {
        workExperience[workExperience.length] = allWorkExperiences[i];
      }
      setWorkExperiences(workExperience);
    }
  };

  const nextWorkExperienceClick = () => {
    if (workExperiencePage < lastWorkExperiencePage) {
      setWorkExperiencePage(workExperiencePage + 1);
      const next = workExperiencePage + 1;
      let workExperience = [];
      for (
        let i = (next - 1) * workExperiencePerPage;
        i < min(allWorkExperiences.length, next * workExperiencePerPage);
        i++
      ) {
        workExperience[workExperience.length] = allWorkExperiences[i];
      }
      setWorkExperiences(workExperience);
    }
  };

  const lastWorkExperienceClick = () => {
    if (workExperiencePage < lastWorkExperiencePage) {
      setWorkExperiencePage(lastWorkExperiencePage);
      const last = lastWorkExperiencePage;
      let workExperience = [];
      for (
        let i = (last - 1) * workExperiencePerPage;
        i < min(allWorkExperiences.length, last * workExperiencePerPage);
        i++
      ) {
        workExperience[workExperience.length] = allWorkExperiences[i];
      }
      setWorkExperiences(workExperience);
    }
  };

  const getProjects = async () => {
    await axios
      .get(`${process.env.NEXT_PUBLIC_PROFILE_API}/project`, {
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_AUTH_KEY}`,
        },
      })
      .then((response) => {
        setAllProjects(response.data);
        setFilterProjects(response.data);
        setLastProjectPage(
          parseInt((response.data.length - 1) / projectPerPage) + 1
        );
        let project = [];
        for (let i = 0; i < min(projectPerPage, response.data.length); i++) {
          project.push(response.data[i]);
        }
        setProjects(project);
      })
      .catch((e) => {
        setFilterProjects(allProjects);
        setLastProjectPage(
          parseInt((allProjects.length - 1) / projectPerPage) + 1
        );
        let project = [];
        for (let i = 0; i < min(projectPerPage, allProjects.length); i++) {
          project.push(allProjects[i]);
        }
        setProjects(project);
      });
  };

  const filter = async (value) => {
    setProjectPage(1);
    let filterProject = [];
    for (let i = 0; i < allProjects.length; i++) {
      if (allProjects[i].description.indexOf(value) > -1) {
        filterProject.push(allProjects[i]);
      }
    }
    setFilterProjects(filterProject);
    setLastProjectPage(
      parseInt((filterProject.length - 1) / projectPerPage) + 1
    );
    let project = [];
    for (let i = 0; i < min(projectPerPage, filterProject.length); i++) {
      project.push(filterProject[i]);
    }
    setProjects(project);
  };

  const clear = async (e) => {
    setProjectPage(1);
    setFilterProjects([...allProjects]);
    setLastProjectPage(parseInt((allProjects.length - 1) / projectPerPage) + 1);
    let project = [];
    for (let i = 0; i < min(projectPerPage, allProjects.length); i++) {
      project.push(allProjects[i]);
    }
    setProjects(project);
  };

  const firstProjectClick = () => {
    if (projectPage > 1) {
      setProjectPage(1);
      const last = 1;
      let project = [];
      for (
        let i = (last - 1) * projectPerPage;
        i < min(filterProjects.length, last * projectPerPage);
        i++
      ) {
        project[project.length] = filterProjects[i];
      }
      setProjects(project);
    }
  };

  const prevProjectClick = () => {
    if (projectPage > 1) {
      setProjectPage(projectPage - 1);
      const next = projectPage - 1;
      let project = [];
      for (
        let i = (next - 1) * projectPerPage;
        i < min(filterProjects.length, next * projectPerPage);
        i++
      ) {
        project[project.length] = filterProjects[i];
      }
      setProjects(project);
    }
  };

  const nextProjectClick = () => {
    if (projectPage < lastProjectPage) {
      setProjectPage(projectPage + 1);
      const next = projectPage + 1;
      let project = [];
      for (
        let i = (next - 1) * projectPerPage;
        i < min(filterProjects.length, next * projectPerPage);
        i++
      ) {
        project[project.length] = filterProjects[i];
      }
      setProjects(project);
    }
  };

  const lastProjectClick = () => {
    if (projectPage < lastProjectPage) {
      setProjectPage(lastProjectPage);
      const last = lastProjectPage;
      let project = [];
      for (
        let i = (last - 1) * projectPerPage;
        i < min(filterProjects.length, last * projectPerPage);
        i++
      ) {
        project[project.length] = filterProjects[i];
      }
      setProjects(project);
    }
  };

  const min = (a, b) => {
    if (a < b) {
      return a;
    } else {
      return b;
    }
  };

  const filterOptions = [
    { value: "ReactJS", label: "ReactJS" },
    { value: "VueJS", label: "VueJS" },
    { value: "NextJS", label: "NextJS" },
    { value: "React Native", label: "React Native" },
    { value: "ExpressJS", label: "ExpressJS" },
    { value: "NestJS", label: "NestJS" },
    { value: "Flask", label: "Flask" },
    { value: "Go", label: "Go" },
    { value: "Laravel", label: "Laravel" },
    { value: "CodeIgniter", label: "CodeIgniter" },
    { value: "C#", label: "C#" },
    { value: "Spring Boot", label: "Spring Boot" },
    { value: "JAX-WS", label: "JAX-WS" },
    { value: "JavaFX", label: "JavaFX" },
    { value: "Swing", label: "Swing" },
    { value: "Kotlin", label: "Kotlin" },
  ];

  return (
    <div>
      <Head>
        <title>Willy Wilsen</title>
        <meta name="description" content="Willy Wilsen" />
        <link rel="icon" href="/WW.ico" />
      </Head>

      <main>
        <header className={custom.header}>
          <div className={`${custom.container} container`}>
            <ul className={`${custom.socialicons} pt-3`}>
              <li className={`${custom.socialicons}`}>
                <a
                  rel="noreferrer"
                  className={`${custom.sociallink}`}
                  href="https://github.com/TubesForLyfe"
                  target="_blank"
                >
                  <Image
                    alt="Github"
                    title="Github"
                    src="/icon/WhiteGithub.png"
                    width={30}
                    height={30}
                  />
                </a>
              </li>
              <li className={`${custom.socialicons}`}>
                <a
                  rel="noreferrer"
                  className={`${custom.sociallink}`}
                  href="mailto: willywilsen.ww@gmail.com"
                  target="_blank"
                >
                  <Image
                    alt="Email"
                    title="Email"
                    src="/icon/WhiteEmail.png"
                    width={30}
                    height={30}
                  />
                </a>
              </li>
              <li className={`${custom.socialicons}`}>
                <a
                  rel="noreferrer"
                  className={`${custom.sociallink}`}
                  href="https://www.linkedin.com/in/willywilsen/"
                  target="_blank"
                >
                  <Image
                    alt="LinkedIn"
                    title="LinkedIn"
                    src="/icon/WhiteLinkedIn.png"
                    width={30}
                    height={30}
                  />
                </a>
              </li>
              <li className={`${custom.socialicons}`}>
                <a
                  rel="noreferrer"
                  className={`${custom.sociallink}`}
                  href="https://wa.me/6281949467344"
                  target="_blank"
                >
                  <Image
                    alt="Whatsapp"
                    title="Whatsapp"
                    src="/icon/WhiteWhatsapp.png"
                    width={30}
                    height={30}
                  />
                </a>
              </li>
            </ul>
            <div className={custom.headercontent}>
              <h4 className={custom.headersubtitle}>Hello, I am</h4>
              <h1 className={custom.headertitle}>Willy Wilsen</h1>
              <h6 className={custom.headermono}>
                Software Engineer | Data Engineer | Technical Lead | Cyber
                Security Engineer | Software Quality Assurance Engineer
              </h6>
              <a
                rel="noreferrer"
                href="https://drive.google.com/uc?id=1VBdCAKrL-YaqKJoc5GgQN3CklQh3A2UZ&export=download"
                target="_blank"
              >
                <button
                  className={`${custom.btn} ${custom.btnprimary} btn-rounded`}
                >
                  <i className="pr-2"></i>Download CV
                </button>
              </a>
            </div>
          </div>
        </header>

        <div className="container-fluid">
          <div id="about" className={`row ${custom.aboutsection}`}>
            <div className={`col-lg-4 ${custom.aboutcard}`}>
              <h3 className={`${custom.fontweightlight}`}>
                Professional Summary
              </h3>
              <span className={`${custom.line} mb-5`}></span>
              <p className="mt-20">
                Highly skilled and versatile professional with expertise in
                Software Engineering, Data Engineering, Technical Leadership,
                and Cyber Security. Adept at designing and developing innovative
                solutions to complex technical challenges. Proven ability to
                lead and collaborate with cross-functional teams, ensuring
                successful project delivery. Curious, adaptable, and
                continuously seeking opportunities to provide secure and
                efficient solutions that elevate organizational performance.
              </p>
              <a
                rel="noreferrer"
                href="https://drive.google.com/uc?id=1VBdCAKrL-YaqKJoc5GgQN3CklQh3A2UZ&export=download"
                target="_blank"
              >
                <button className="btn btn-outline-danger">
                  <i className="icon-down-circled2 "></i>Download My CV
                </button>
              </a>
            </div>
            <div className={`col-lg-4 ${custom.aboutcard}`}>
              <h3 className={`${custom.fontweightlight}`}>Personal Info</h3>
              <span className={`${custom.line} mb-5`}></span>
              <ul className={`mt40 ${custom.info} list-unstyled`}>
                <li>
                  <span>Github</span> : WillyWilsen
                </li>
                <li>
                  <span>Email</span> : willywilsen@gmail.com
                </li>
                <li>
                  <span>LinkedIn</span> : Willy Wilsen{" "}
                </li>
                <li>
                  <span>Phone</span> : +62 819-4946-7344
                </li>
                <li>
                  <span>Country</span> : Indonesia
                </li>
              </ul>
              <ul className={`${custom.socialicons} pt-3`}>
                <li className={`${custom.socialicons}`}>
                  <a
                    rel="noreferrer"
                    className={`${custom.sociallink}`}
                    href="https://github.com/WillyWilsen"
                    target="_blank"
                  >
                    <Image
                      alt="Github"
                      title="Github"
                      src="/icon/RedGithub.png"
                      width={30}
                      height={30}
                    />
                  </a>
                </li>
                <li className={`${custom.socialicons}`}>
                  <a
                    rel="noreferrer"
                    className={`${custom.sociallink}`}
                    href="mailto: willywilsen.ww@gmail.com"
                    target="_blank"
                  >
                    <Image
                      alt="Email"
                      title="Email"
                      src="/icon/RedEmail.png"
                      width={30}
                      height={30}
                    />
                  </a>
                </li>
                <li className={`${custom.socialicons}`}>
                  <a
                    rel="noreferrer"
                    className={`${custom.sociallink}`}
                    href="https://www.linkedin.com/in/willywilsen/"
                    target="_blank"
                  >
                    <Image
                      alt="LinkedIn"
                      title="LinkedIn"
                      src="/icon/RedLinkedIn.png"
                      width={30}
                      height={30}
                    />
                  </a>
                </li>
                <li className={`${custom.socialicons}`}>
                  <a
                    rel="noreferrer"
                    className={`${custom.sociallink}`}
                    href="https://wa.me/6281949467344"
                    target="_blank"
                  >
                    <Image
                      alt="Whatsapp"
                      title="Whatsapp"
                      src="/icon/RedWhatsapp.png"
                      width={30}
                      height={30}
                    />
                  </a>
                </li>
              </ul>
            </div>
            <div className={`col-lg-4 ${custom.aboutcard}`}>
              <h3 className={`${custom.fontweightlight}`}>My Expertise</h3>
              <span className={`${custom.line} mb-5`}></span>
              <div className={custom.row}>
                <div className="col-1 text-danger pt-1">
                  <Image
                    alt="Code"
                    src="/icon/Code.png"
                    width={30}
                    height={30}
                  />
                </div>
                <div className={`col-10 ${custom.mlauto} me-3`}>
                  <h6>Software Development</h6>
                  <p>Experienced in developing software (Advanced).</p>
                  <hr></hr>
                </div>
              </div>
              <div className={custom.row}>
                <div className="col-1 text-danger pt-1">
                  <Image
                    alt="ProblemSolving"
                    src="/icon/ProblemSolving.png"
                    width={30}
                    height={30}
                  />
                </div>
                <div className={`col-10 ${custom.mlauto} me-3`}>
                  <h6>Data Engineering</h6>
                  <p>Experienced in data engineering (Intermediate).</p>
                  <hr></hr>
                </div>
              </div>
              <div className={custom.row}>
                <div className="col-1 text-danger pt-1">
                  <Image
                    alt="ProjectManager"
                    src="/icon/ProjectManager.png"
                    width={30}
                    height={30}
                  />
                </div>
                <div className={`col-10 ${custom.mlauto} me-3`}>
                  <h6>Technical Lead</h6>
                  <p>
                    Experienced in project & human resource management
                    (Intermediate).
                  </p>
                  <hr></hr>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className={custom.section} id="resume">
          <div className="container">
            <h2 className="mb-5">
              <span className="text-danger">My</span> Resume
            </h2>
            <div className="row">
              <div className="col-md-6 col-lg-4">
                <div className={custom.card}>
                  <div className={custom.cardheader}>
                    <div className="mt-2">
                      <h4>Work Experience</h4>
                      <span className={custom.line}></span>
                    </div>
                  </div>
                  <div className={custom.cardbody}>
                    <div className={`text-center ${custom.seemore}`}>
                      <span
                        className="mx-2"
                        onClick={() => prevWorkExperienceClick()}
                      >
                        {" < "}
                      </span>
                      {workExperiencePage > 1 && (
                        <span
                          className="mx-2"
                          onClick={() => firstWorkExperienceClick()}
                        >
                          {" 1 "}
                        </span>
                      )}
                      {workExperiencePage - 2 > 1 && (
                        <span className="mx-2">{" .. "}</span>
                      )}
                      {workExperiencePage - 1 > 1 && (
                        <span
                          className="mx-2"
                          onClick={() => prevWorkExperienceClick()}
                        >{` ${workExperiencePage - 1} `}</span>
                      )}

                      <span className="mx-2">
                        <strong>{` ${workExperiencePage} `}</strong>
                      </span>

                      {workExperiencePage + 1 < lastWorkExperiencePage && (
                        <span
                          className="mx-2"
                          onClick={() => nextWorkExperienceClick()}
                        >{` ${workExperiencePage + 1} `}</span>
                      )}
                      {workExperiencePage + 2 < lastWorkExperiencePage && (
                        <span className="mx-2">{" .. "}</span>
                      )}
                      {workExperiencePage < lastWorkExperiencePage && (
                        <span
                          className="mx-2"
                          onClick={() => lastWorkExperienceClick()}
                        >{` ${lastWorkExperiencePage} `}</span>
                      )}
                      <span
                        className="mx-2"
                        onClick={() => nextWorkExperienceClick()}
                      >
                        {" > "}
                      </span>
                    </div>
                    {workExperiences.map((workExperience, key) => {
                      return (
                        <div key={key}>
                          <h6 className={`${custom.title} text-danger`}>
                            {workExperience.from} - {workExperience.to}
                          </h6>
                          <p>
                            <b>
                              {workExperience.job_position} at{" "}
                              {workExperience.company}
                            </b>
                          </p>
                          <div id={`work-experience_${key}`}>
                            {workExperience.description}
                          </div>
                          {key !== workExperiences.length - 1 && <hr></hr>}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className={custom.card}>
                  <div className={custom.cardheader}>
                    <div className="mt-2">
                      <h4>Education</h4>
                      <span className={custom.line}></span>
                    </div>
                  </div>
                  <div className={custom.cardbody}>
                    <h6 className="title text-danger">2020</h6>
                    <p>
                      <b>Bandung Institute of Technology</b>
                    </p>
                    <p className="subtitle">
                      Bachelor of Engineering, Computer Science
                    </p>
                  </div>
                </div>
                <div className={custom.card}>
                  <div className={custom.cardheader}>
                    <div className="mt-2">
                      <h4>Skills</h4>
                      <span className={custom.line}></span>
                    </div>
                  </div>
                  <div className={custom.cardbody}>
                    <ul>
                      <li>
                        <h6>Algorithm Strategy</h6>
                      </li>
                      <li>
                        <h6>Object Oriented Programming</h6>
                      </li>
                      <li>
                        <h6>Manual & Automation Testing</h6>
                      </li>
                      <li>
                        <h6>Web & Database Security</h6>
                      </li>
                      <li>
                        <h6>Query Optimization</h6>
                      </li>
                      <li>
                        <h6>SOAP, REST, & GraphQL Web Services</h6>
                      </li>
                      <li>
                        <h6>Cloud Computing</h6>
                      </li>
                      <li>
                        <h6>Artificial Intelligence</h6>
                      </li>
                      <li>
                        <h6>Machine Learning</h6>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className={custom.card}>
                  <div className={custom.cardheader}>
                    <div className="mt-2">
                      <h4>Certificates</h4>
                      <span className={custom.line}></span>
                    </div>
                  </div>
                  <div className={custom.cardbody}>
                    <h6>
                      <b>Coursera</b>
                    </h6>
                    <ul>
                      <li>
                        <h6>Google IT Support (Dec 2023)</h6>
                      </li>
                      <li>
                        <h6>Google Cybersecurity (Aug 2023)</h6>
                      </li>
                      <li>
                        <h6>
                          Preparing for Google Cloud Certification: Cloud
                          Security Engineer (May 2023)
                        </h6>
                      </li>
                      <li>
                        <h6>
                          Preparing for Google Cloud Certification: Cloud
                          Network Engineer (May 2023)
                        </h6>
                      </li>
                    </ul>
                    <hr></hr>
                    <h6>
                      <b>Dicoding</b>
                    </h6>
                    <ul>
                      <li>
                        <h6>Becoming a Google Cloud Architect (Dec 2023)</h6>
                      </li>
                      <li>
                        <h6>Basic Machine Learning (Dec 2023)</h6>
                      </li>
                      <li>
                        <h6>Becoming a Google Cloud Engineer (Oct 2023)</h6>
                      </li>
                      <li>
                        <h6>(Google Cloud) Back-End Basic (Aug 2023)</h6>
                      </li>
                    </ul>
                    <hr></hr>
                    <h6>
                      <b>LinkedIn</b>
                    </h6>
                    <ul>
                      <li>
                        <h6>
                          Cloud Computing Careers and Certifications: First
                          Steps (Apr 2023)
                        </h6>
                      </li>
                      <li>
                        <h6>Cybersecurity at Work (Apr 2023)</h6>
                      </li>
                    </ul>
                    <hr></hr>
                    <h6>
                      <b>RevoU</b>
                    </h6>
                    <ul>
                      <li>
                        <h6>Intro to Data Analytics (May 2023)</h6>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-lg-4">
                <div className={custom.card}>
                  <div className={custom.cardheader}>
                    <div className="pull-left">
                      <h4 className="mt-2">Tech Stack</h4>
                      <span className={custom.line}></span>
                    </div>
                  </div>
                  <div className={`${custom.cardbody} pb-2`}>
                    <h6>
                      <b>Frontend</b>
                    </h6>
                    <ul>
                      <li>
                        <h6>ReactJS</h6>
                      </li>
                      <li>
                        <h6>VueJS</h6>
                      </li>
                      <li>
                        <h6>AngularJS</h6>
                      </li>
                      <li>
                        <h6>NextJS</h6>
                      </li>
                      <li>
                        <h6>React Native</h6>
                      </li>
                      <li>
                        <h6>Android Studio</h6>
                      </li>
                    </ul>
                    <hr></hr>
                    <h6>
                      <b>Backend</b>
                    </h6>
                    <ul>
                      <li>
                        <h6>NodeJS (ExpressJS, NestJS, HapiJS)</h6>
                      </li>
                      <li>
                        <h6>Python (Flask, Django)</h6>
                      </li>
                      <li>
                        <h6>Go (Gin, Echo)</h6>
                      </li>
                      <li>
                        <h6>PHP (Laravel, CodeIgniter)</h6>
                      </li>
                      <li>
                        <h6>C# (.NET, Unity)</h6>
                      </li>
                      <li>
                        <h6>Java (Spring Boot, JAX-WS, JavaFX, Swing)</h6>
                      </li>
                    </ul>
                    <hr></hr>
                    <h6>
                      <b>Database</b>
                    </h6>
                    <ul>
                      <li>
                        <h6>MySQL</h6>
                      </li>
                      <li>
                        <h6>PostgreSQL</h6>
                      </li>
                      <li>
                        <h6>SQL Server</h6>
                      </li>
                      <li>
                        <h6>MongoDB</h6>
                      </li>
                      <li>
                        <h6>Redis</h6>
                      </li>
                    </ul>
                    <hr></hr>
                    <h6>
                      <b>Cloud</b>
                    </h6>
                    <ul>
                      <li>
                        <h6>AWS</h6>
                      </li>
                      <li>
                        <h6>Azure</h6>
                      </li>
                      <li>
                        <h6>GCP</h6>
                      </li>
                    </ul>
                    <hr></hr>
                    <h6>
                      <b>DevOps</b>
                    </h6>
                    <ul>
                      <li>
                        <h6>Docker</h6>
                      </li>
                      <li>
                        <h6>CI/CD</h6>
                      </li>
                    </ul>
                    <hr></hr>
                    <h6>
                      <b>Automation Testing</b>
                    </h6>
                    <ul>
                      <li>
                        <h6>Selenium</h6>
                      </li>
                    </ul>
                    <hr></hr>
                    <h6>
                      <b>Penetration Testing</b>
                    </h6>
                    <ul>
                      <li>
                        <h6>Burp Suite</h6>
                      </li>
                      <li>
                        <h6>OWASP ZAP</h6>
                      </li>
                    </ul>
                    <hr></hr>
                    <h6>
                      <b>UI Library</b>
                    </h6>
                    <ul>
                      <li>
                        <h6>Ant Design</h6>
                      </li>
                    </ul>
                    <hr></hr>
                    <h6>
                      <b>Workflow Automation</b>
                    </h6>
                    <ul>
                      <li>
                        <h6>Apache Airflow</h6>
                      </li>
                    </ul>
                    <hr></hr>
                    <h6>
                      <b>Message Queuing</b>
                    </h6>
                    <ul>
                      <li>
                        <h6>ActiveMQ</h6>
                      </li>
                    </ul>
                    <hr></hr>
                    <h6>
                      <b>Others</b>
                    </h6>
                    <ul>
                      <li>
                        <h6>Linux</h6>
                      </li>
                      <li>
                        <h6>Typescript</h6>
                      </li>
                      <li>
                        <h6>WebGL</h6>
                      </li>
                      <li>
                        <h6>
                          Google Tool (Docs, Spreadsheet, Data Studio, Slides)
                        </h6>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className={custom.section} id="service">
          <div className="container">
            <h2 className="mb-5 pb-4">
              <span className="text-danger">My</span> Latest Projects
            </h2>
            <div className="d-flex flex-row mb-4">
              <Select
                options={filterOptions}
                className="col-md-3"
                placeholder="Filter by"
                onChange={(e) => filter(e.value)}
              />
              <button className="btn btn-danger ms-3" onClick={(e) => clear(e)}>
                Clear
              </button>
            </div>
            <div className="row">
              {projects.map((project, key) => {
                return (
                  <div key={key} className="col-md-4 col-sm-6">
                    <div className={`${custom.card} mb-5`}>
                      <div className={`${custom.cardheader} ${custom.hasicon}`}>
                        <Image
                          alt="Project"
                          src="/icon/Project.png"
                          width={30}
                          height={30}
                        />
                      </div>
                      <div className={`${custom.cardbody} px-4 py-3`}>
                        <a
                          rel="noreferrer"
                          href={project.link}
                          target="_blank"
                          className={custom.notunderline}
                        >
                          <Image
                            alt="ProjectImage"
                            src={project.image_path}
                            width="100%"
                            height="100%"
                            layout="responsive"
                            objectFit="contain"
                          />
                        </a>
                        <h5
                          className={`mb-3 ${custom.cardtitle} text-dark mt-1`}
                        >
                          {project.title}
                        </h5>
                        <div id={`project_${key}`}>{project.description}</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className={`text-center ${custom.seemore}`}>
              <span className="mx-2" onClick={() => prevProjectClick()}>
                {" < "}
              </span>
              {projectPage > 1 && (
                <span className="mx-2" onClick={() => firstProjectClick()}>
                  {" 1 "}
                </span>
              )}
              {projectPage - 2 > 1 && <span className="mx-2">{" .. "}</span>}
              {projectPage - 1 > 1 && (
                <span className="mx-2" onClick={() => prevProjectClick()}>{` ${
                  projectPage - 1
                } `}</span>
              )}

              <span className="mx-2">
                <strong>{` ${projectPage} `}</strong>
              </span>

              {projectPage + 1 < lastProjectPage && (
                <span className="mx-2" onClick={() => nextProjectClick()}>{` ${
                  projectPage + 1
                } `}</span>
              )}
              {projectPage + 2 < lastProjectPage && (
                <span className="mx-2">{" .. "}</span>
              )}
              {projectPage < lastProjectPage && (
                <span
                  className="mx-2"
                  onClick={() => lastProjectClick()}
                >{` ${lastProjectPage} `}</span>
              )}
              <span className="mx-2" onClick={() => nextProjectClick()}>
                {" > "}
              </span>
            </div>
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <p>©2022 Willy Wilsen</p>
      </footer>
    </div>
  );
}
