export type Voter = {
  id: string;
  nameEn: string;
  nameHi: string;
  ward: number;
  booth: string;
  relation: string;
};

export type Candidate = {
  ward: number;
  nameEn: string;
  nameHi: string;
  party: string;
  symbol: string;
};

/** Sample Bihar-style demo entries — not real electoral roll data. */
export const voters: Voter[] = [
  {
    id: "BR26-PN-10001",
    nameEn: "Ramesh Kumar",
    nameHi: "रमेश कुमार",
    ward: 1,
    booth: "PS Middle School, Khagaul",
    relation: "Father: Suresh Prasad",
  },
  {
    id: "BR26-PN-10002",
    nameEn: "Sunita Devi",
    nameHi: "सुनीता देवी",
    ward: 1,
    booth: "Anganwadi Centre, Ward 1",
    relation: "Husband: Ajay Singh",
  },
  {
    id: "BR26-PN-10003",
    nameEn: "Deepak Paswan",
    nameHi: "दीपक पासवान",
    ward: 1,
    booth: "Panchayat Bhawan, Ward 1",
    relation: "Father: Ram Bilas Paswan",
  },
  {
    id: "BR26-PN-10004",
    nameEn: "Manju Kumari",
    nameHi: "मंजू कुमारी",
    ward: 2,
    booth: "UP School, Sandalpur",
    relation: "Father: Shyam Kishore",
  },
  {
    id: "BR26-PN-10015",
    nameEn: "Amit Ranjan",
    nameHi: "अमित रंजन",
    ward: 2,
    booth: "High School, Block Road",
    relation: "Father: Vinod Ranjan",
  },
  {
    id: "BR26-PN-10016",
    nameEn: "Surendra Mandal",
    nameHi: "सुरेंद्र मंडल",
    ward: 2,
    booth: "Community Hall, Ward 2",
    relation: "Father: Basudev Mandal",
  },
  {
    id: "BR26-PN-10022",
    nameEn: "Priya Kumari",
    nameHi: "प्रिया कुमारी",
    ward: 2,
    booth: "Community Hall, Ward 2",
    relation: "Father: Ravi Shankar",
  },
  {
    id: "BR26-PN-10033",
    nameEn: "Anita Devi",
    nameHi: "अनीता देवी",
    ward: 3,
    booth: "Primary School, East Lane",
    relation: "Husband: Vinod Mahto",
  },
  {
    id: "BR26-PN-10040",
    nameEn: "Md. Imran",
    nameHi: "मो0 इमरान",
    ward: 3,
    booth: "Primary School, East Lane",
    relation: "Father: Md. Salim",
  },
  {
    id: "BR26-PN-10041",
    nameEn: "Binod Thakur",
    nameHi: "बिनोद ठाकुर",
    ward: 3,
    booth: "Middle School, Ward 3",
    relation: "Father: Jai Prakash Thakur",
  },
  {
    id: "BR26-PN-10051",
    nameEn: "Kavita Mishra",
    nameHi: "कविता मिश्रा",
    ward: 4,
    booth: "Panchayat Bhawan Compound",
    relation: "Husband: Dinesh Mishra",
  },
  {
    id: "BR26-PN-10052",
    nameEn: "Geeta Devi",
    nameHi: "गीता देवी",
    ward: 4,
    booth: "Anganwadi, Ward 4",
    relation: "Husband: Ramashray Sah",
  },
  {
    id: "BR26-PN-10067",
    nameEn: "Vikash Yadav",
    nameHi: "विकाश यादव",
    ward: 5,
    booth: "UP School, Tola Bazaar",
    relation: "Father: Ram Naresh Yadav",
  },
  {
    id: "BR26-PN-10068",
    nameEn: "Nitesh Kumar",
    nameHi: "नितेश कुमार",
    ward: 5,
    booth: "High School Ground, Ward 5",
    relation: "Father: Arjun Kumar",
  },
  {
    id: "BR26-PN-10069",
    nameEn: "Shyam Sundar Sah",
    nameHi: "श्याम सुंदर साह",
    ward: 5,
    booth: "Primary School, North Tola",
    relation: "Father: Ram Avtar Sah",
  },
];

export const candidates: Candidate[] = [
  {
    ward: 1,
    nameEn: "Arvind Mishra",
    nameHi: "अरविंद मिश्रा",
    party: "JD(U)",
    symbol: "Arrow / तीर",
  },
  {
    ward: 1,
    nameEn: "Rekha Devi",
    nameHi: "रेखा देवी",
    party: "RJD",
    symbol: "Hurricane lamp / लालटेन",
  },
  {
    ward: 1,
    nameEn: "Pankaj Singh",
    nameHi: "पंकज सिंह",
    party: "BJP",
    symbol: "Lotus / कमल",
  },
  {
    ward: 1,
    nameEn: "Lalita Devi",
    nameHi: "ललिता देवी",
    party: "INC",
    symbol: "Hand / हाथ",
  },
  {
    ward: 2,
    nameEn: "Sanjeev Rai",
    nameHi: "संजीव राई",
    party: "Independent",
    symbol: "Ear of Corn / धान की बाली",
  },
  {
    ward: 2,
    nameEn: "Poonam Kumari",
    nameHi: "पूनम कुमारी",
    party: "Independent",
    symbol: "Table / टेबल",
  },
  {
    ward: 3,
    nameEn: "Raghunath Pandey",
    nameHi: "रघुनाथ पांडे",
    party: "JD(U)",
    symbol: "Kalash / कलश",
  },
  {
    ward: 4,
    nameEn: "Meera Devi",
    nameHi: "मीरा देवी",
    party: "Independent",
    symbol: "Hand Pump / हैंडपंप",
  },
  {
    ward: 4,
    nameEn: "Rajesh Kushwaha",
    nameHi: "राजेश कुशवाहा",
    party: "Independent",
    symbol: "Cup & Saucer / कप और सॉसर",
  },
  {
    ward: 5,
    nameEn: "Anil Sharma",
    nameHi: "अनिल शर्मा",
    party: "Independent",
    symbol: "Scissors / कैंची",
  },
  {
    ward: 6,
    nameEn: "Rajendra Prasad",
    nameHi: "राजेंद्र प्रसाद",
    party: "Independent",
    symbol: "Bicycle / साइकिल",
  },
  {
    ward: 6,
    nameEn: "Savitri Devi",
    nameHi: "सावित्री देवी",
    party: "Independent",
    symbol: "Banana / केला",
  },
  {
    ward: 7,
    nameEn: "Mukesh Kumar",
    nameHi: "मुकेश कुमार",
    party: "Independent",
    symbol: "Bow & Arrow / धनुष बाण",
  },
  {
    ward: 7,
    nameEn: "Anjali Kumari",
    nameHi: "अंजलि कुमारी",
    party: "Independent",
    symbol: "Car / कार",
  },
  {
    ward: 8,
    nameEn: "Vijay Singh",
    nameHi: "विजय सिंह",
    party: "Independent",
    symbol: "Chair / कुर्सी",
  },
  {
    ward: 8,
    nameEn: "Rashmi Devi",
    nameHi: "रश्मि देवी",
    party: "Independent",
    symbol: "Coconut / नारियल",
  },
  {
    ward: 9,
    nameEn: "Sunil Kumar",
    nameHi: "सुनील कुमार",
    party: "Independent",
    symbol: "Drum / ढोल",
  },
  {
    ward: 9,
    nameEn: "Pooja Kumari",
    nameHi: "पूजा कुमारी",
    party: "Independent",
    symbol: "Elephant / हाथी",
  },
  {
    ward: 10,
    nameEn: "Aman Kumar",
    nameHi: "अमन कुमार",
    party: "Independent",
    symbol: "Earring / कुंडल",
  },
  {
    ward: 10,
    nameEn: "Kiran Devi",
    nameHi: "किरण देवी",
    party: "Independent",
    symbol: "Fan / पंखा",
  },
  {
    ward: 11,
    nameEn: "Rohit Kumar",
    nameHi: "रोहित कुमार",
    party: "Independent",
    symbol: "Flower / फूल",
  },
  {
    ward: 11,
    nameEn: "Sunita Devi",
    nameHi: "सुनीता देवी",
    party: "Independent",
    symbol: "Fruit / फल",
  },
  {
    ward: 12,
    nameEn: "Amit Kumar",
    nameHi: "अमित कुमार",
    party: "Independent",
    symbol: "Gas Cylinder / गैस सिलेंडर",
  },
  {
    ward: 12,
    nameEn: "Meena Kumari",
    nameHi: "मीना कुमारी",
    party: "Independent",
    symbol: "Guitar / गिटार",
  },
  {
    ward: 13,
    nameEn: "Vikash Kumar",
    nameHi: "विकाश कुमार",
    party: "Independent",
    symbol: "Helmet / हेलमेट",
  },
  {
    ward: 13,
    nameEn: "Rekha Devi",
    nameHi: "रेखा देवी",
    party: "Independent",
    symbol: "Ice Cream / आइसक्रीम",
  },
];

export const wards = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13];
