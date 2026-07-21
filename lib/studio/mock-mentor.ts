export type StudioMentor = {
  id: string;
  name: string;
  position: string;
  description: string;
  photoUrl: string;
};

export type StudioMentorData = {
  mentors: StudioMentor[];
};

export const defaultStudioMentorData: StudioMentorData = {
  mentors: [
    {
      id: "m1",
      name: "Raka",
      position: "Addon Developer",
      description:
        "Membantu anak memahami alur addon dan membangun project dengan rapi.",
      photoUrl: "",
    },
    {
      id: "m2",
      name: "Nadia",
      position: "Education Mentor",
      description:
        "Fokus pada pembelajaran yang fun, jelas, dan mudah dipraktikkan.",
      photoUrl: "",
    },
  ],
};