export interface Band {
  symbol: string;
  name: string;
  origin: string;
  year: number;
  category: 'classic' | 'noble' | 'alternative' | 'nu' | 'transition' | 'extreme';
  row: number;
  col: number;
  description?: string;
  topAlbums?: { title: string; coverUrl?: string }[];
}

export const categories = {
  classic: { name: "60's Classic Metals", color: "#B03030" },
  noble: { name: "Noble Rocks", color: "#D4AF37" },
  alternative: { name: "Alternative Metals", color: "#CC5500" },
  nu: { name: "Nu Metals", color: "#4C9141" },
  transition: { name: "Transition Metals", color: "#800080" },
  extreme: { name: "Extreme Metals", color: "#1E3F66" },
};

export const bands: Band[] = [
  // 60's Classic Metals (Red) - Left side columns 1-2
  { 
    symbol: "Lz", 
    name: "Led Zeppelin", 
    origin: "United Kingdom", 
    year: 1968, 
    category: "classic", 
    row: 1, 
    col: 1,
    description: "One of the most influential and innovative rock groups in history, known for their heavy, guitar-driven sound and blending various musical styles including blues and folk.",
    topAlbums: [
      { title: "Led Zeppelin IV" },
      { title: "Physical Graffiti" },
      { title: "Led Zeppelin II" }
    ]
  },
  { symbol: "Sc", name: "Steppenwolf", origin: "Canada", year: 1967, category: "classic", row: 1, col: 2 },
  { symbol: "Dp", name: "Deep Purple", origin: "United Kingdom", year: 1968, category: "classic", row: 2, col: 1 },
  { symbol: "Tw", name: "The Who", origin: "United Kingdom", year: 1964, category: "classic", row: 2, col: 2 },
  { symbol: "Sw", name: "The Sweet", origin: "United Kingdom", year: 1968, category: "classic", row: 3, col: 1 },
  { symbol: "Qr", name: "Queen", origin: "United Kingdom", year: 1970, category: "classic", row: 3, col: 2 },
  { symbol: "Ru", name: "Rush", origin: "Canada", year: 1968, category: "classic", row: 4, col: 1 },
  { symbol: "Mo", name: "Motörhead", origin: "United Kingdom", year: 1975, category: "classic", row: 4, col: 2 },
  { symbol: "Rs", name: "Rolling Stones", origin: "United Kingdom", year: 1962, category: "classic", row: 5, col: 1 },
  { symbol: "Sd", name: "Steely Dan", origin: "United States", year: 1972, category: "classic", row: 5, col: 2 },
  { symbol: "Yb", name: "Yardbirds", origin: "United Kingdom", year: 1963, category: "classic", row: 6, col: 1 },
  { symbol: "Vf", name: "Vanilla Fudge", origin: "United States", year: 1967, category: "classic", row: 6, col: 2 },
  { symbol: "Oz", name: "Ozzy Osbourne", origin: "United Kingdom", year: 1968, category: "classic", row: 7, col: 1 },
  { symbol: "Jh", name: "Jimi Hendrix", origin: "United States", year: 1966, category: "classic", row: 7, col: 2 },
  
  // Noble Rocks (Gold) - Far right column 18
  { symbol: "He", name: "Heart", origin: "United States", year: 1970, category: "noble", row: 1, col: 18 },
  { symbol: "Ai", name: "Alice in Chains", origin: "United States", year: 1987, category: "noble", row: 2, col: 18 },
  { symbol: "Rm", name: "Rage Against Machine", origin: "United States", year: 1991, category: "noble", row: 3, col: 18 },
  { symbol: "Vh", name: "Van Halen", origin: "United States", year: 1972, category: "noble", row: 4, col: 18 },
  { symbol: "Lc", name: "Living Colour", origin: "United States", year: 1984, category: "noble", row: 5, col: 18 },
  { symbol: "Nv", name: "Nirvana", origin: "United States", year: 1987, category: "noble", row: 6, col: 18 },
  { symbol: "Kx", name: "King's X", origin: "United States", year: 1980, category: "noble", row: 7, col: 18 },
  
  // Alternative Metals (Orange) - Right block columns 13-17
  { symbol: "Bb", name: "Bad Brains", origin: "United States", year: 1976, category: "alternative", row: 1, col: 13 },
  { symbol: "Dz", name: "Danzig", origin: "United States", year: 1987, category: "alternative", row: 1, col: 14 },
  { symbol: "Mm", name: "Marilyn Manson", origin: "United States", year: 1989, category: "alternative", row: 1, col: 15 },
  { symbol: "An", name: "Anthrax", origin: "United States", year: 1981, category: "alternative", row: 1, col: 16 },
  { symbol: "Ra", name: "Rammstein", origin: "Germany", year: 1994, category: "alternative", row: 1, col: 17 },
  
  { symbol: "Sl", name: "Slayer", origin: "United States", year: 1981, category: "alternative", row: 2, col: 13 },
  { symbol: "Ex", name: "Exodus", origin: "United States", year: 1980, category: "alternative", row: 2, col: 14 },
  { symbol: "Ms", name: "Meshuggah", origin: "Sweden", year: 1987, category: "alternative", row: 2, col: 15 },
  { symbol: "Ts", name: "Testament", origin: "United States", year: 1983, category: "alternative", row: 2, col: 16 },
  { symbol: "Sp", name: "Sepultura", origin: "Brazil", year: 1984, category: "alternative", row: 2, col: 17 },
  
  { symbol: "Kr", name: "Kreator", origin: "Germany", year: 1982, category: "alternative", row: 3, col: 13 },
  { symbol: "St", name: "Suicidal Tendencies", origin: "United States", year: 1980, category: "alternative", row: 3, col: 14 },
  { symbol: "Ok", name: "Overkill", origin: "United States", year: 1980, category: "alternative", row: 3, col: 15 },
  { symbol: "Xt", name: "Extreme", origin: "United States", year: 1985, category: "alternative", row: 3, col: 16 },
  { symbol: "Mb", name: "Mr. Bungle", origin: "United States", year: 1985, category: "alternative", row: 3, col: 17 },
  
  { symbol: "Fb", name: "Fishbone", origin: "United States", year: 1979, category: "alternative", row: 4, col: 13 },
  { symbol: "Pr", name: "Primus", origin: "United States", year: 1984, category: "alternative", row: 4, col: 14 },
  { symbol: "Wz", name: "White Zombie", origin: "United States", year: 1985, category: "alternative", row: 4, col: 15 },
  { symbol: "Pn", name: "Pantera", origin: "United States", year: 1981, category: "alternative", row: 4, col: 16 },
  { symbol: "La", name: "Life of Agony", origin: "United States", year: 1989, category: "alternative", row: 4, col: 17 },
  
  // Nu Metals (Green) - Below alternative
  { 
    symbol: "Ty", 
    name: "Type O Negative", 
    origin: "United States", 
    year: 1989, 
    category: "nu", 
    row: 5, 
    col: 13,
    description: "A gothic metal band from Brooklyn, New York, known for their slow, heavy sound and dark humor. Their music is often characterized by baritone vocals and a mix of gothic rock and doom metal.",
    topAlbums: [
      { title: "Bloody Kisses" },
      { title: "October Rust" },
      { title: "World Coming Down" }
    ]
  },
  { symbol: "Sv", name: "Sevendust", origin: "United States", year: 1994, category: "nu", row: 5, col: 14 },
  { symbol: "Cc", name: "Corrosion of Conformity", origin: "United States", year: 1982, category: "nu", row: 5, col: 15 },
  { symbol: "Mn", name: "Monster Magnet", origin: "United States", year: 1989, category: "nu", row: 5, col: 16 },
  { symbol: "Cl", name: "Clutch", origin: "United States", year: 1991, category: "nu", row: 5, col: 17 },
  
  { symbol: "Ko", name: "Korn", origin: "United States", year: 1993, category: "nu", row: 6, col: 13 },
  { symbol: "Lb", name: "Limp Bizkit", origin: "United States", year: 1994, category: "nu", row: 6, col: 14 },
  { symbol: "De", name: "Deftones", origin: "United States", year: 1988, category: "nu", row: 6, col: 15 },
  { symbol: "Pd", name: "P.O.D.", origin: "United States", year: 1992, category: "nu", row: 6, col: 16 },
  { symbol: "Lp", name: "Linkin Park", origin: "United States", year: 1996, category: "nu", row: 6, col: 17 },
  
  { symbol: "Sy", name: "System of a Down", origin: "United States", year: 1994, category: "nu", row: 7, col: 13 },
  { symbol: "Di", name: "Disturbed", origin: "United States", year: 1994, category: "nu", row: 7, col: 14 },
  { symbol: "Ad", name: "Adema", origin: "United States", year: 2000, category: "nu", row: 7, col: 15 },
  { symbol: "Tr", name: "Taproot", origin: "United States", year: 1997, category: "nu", row: 7, col: 16 },
  { symbol: "Sa", name: "Saliva", origin: "United States", year: 1996, category: "nu", row: 7, col: 17 },
  
  // Transition Metals (Purple) - Center block columns 3-12
  { symbol: "Im", name: "Iron Maiden", origin: "United Kingdom", year: 1975, category: "transition", row: 4, col: 3 },
  { 
    symbol: "Mt", 
    name: "Metallica", 
    origin: "United States", 
    year: 1981, 
    category: "transition", 
    row: 4, 
    col: 4,
    description: "The most commercially successful thrash metal band, part of the 'Big Four'. They revolutionized heavy metal with their fast tempos and aggressive musicianship.",
    topAlbums: [
      { title: "Master of Puppets" },
      { title: "Ride the Lightning" },
      { title: "...And Justice for All" }
    ]
  },
  { 
    symbol: "Sr", 
    name: "Slayer", 
    origin: "United States", 
    year: 1981, 
    category: "transition", 
    row: 4, 
    col: 5,
    description: "Known for their extremely fast and aggressive style, Slayer's musical style involves fast tremolo picking and double bass drumming. They are considered one of the 'Big Four' of thrash metal.",
    topAlbums: [
      { title: "Reign in Blood" },
      { title: "South of Heaven" },
      { title: "Seasons in the Abyss" }
    ]
  },
  { symbol: "Ax", name: "Anthrax", origin: "United States", year: 1981, category: "transition", row: 4, col: 6 },
  { symbol: "Mg", name: "Megadeth", origin: "United States", year: 1983, category: "transition", row: 4, col: 7 },
  { symbol: "Ex", name: "Exodus", origin: "United States", year: 1980, category: "transition", row: 4, col: 8 },
  { symbol: "Tt", name: "Testament", origin: "United States", year: 1983, category: "transition", row: 4, col: 9 },
  { symbol: "Ov", name: "Overkill", origin: "United States", year: 1980, category: "transition", row: 4, col: 10 },
  { symbol: "Kt", name: "Kreator", origin: "Germany", year: 1982, category: "transition", row: 4, col: 11 },
  { symbol: "Su", name: "Sepultura", origin: "Brazil", year: 1984, category: "transition", row: 4, col: 12 },
  
  { symbol: "Dt", name: "Death", origin: "United States", year: 1983, category: "transition", row: 5, col: 3 },
  { symbol: "Ob", name: "Obituary", origin: "United States", year: 1984, category: "transition", row: 5, col: 4 },
  { symbol: "Ma", name: "Morbid Angel", origin: "United States", year: 1983, category: "transition", row: 5, col: 5 },
  { symbol: "Ca", name: "Cannibal Corpse", origin: "United States", year: 1988, category: "transition", row: 5, col: 6 },
  { symbol: "Dc", name: "Deicide", origin: "United States", year: 1987, category: "transition", row: 5, col: 7 },
  { symbol: "Sf", name: "Suffocation", origin: "United States", year: 1988, category: "transition", row: 5, col: 8 },
  { symbol: "In", name: "Immolation", origin: "United States", year: 1986, category: "transition", row: 5, col: 9 },
  { symbol: "Nl", name: "Nile", origin: "United States", year: 1993, category: "transition", row: 5, col: 10 },
  { symbol: "Df", name: "Dying Fetus", origin: "United States", year: 1991, category: "transition", row: 5, col: 11 },
  { symbol: "Cy", name: "Cryptopsy", origin: "Canada", year: 1988, category: "transition", row: 5, col: 12 },
  
  { symbol: "Wh", name: "Whitechapel", origin: "United States", year: 2006, category: "transition", row: 6, col: 3 },
  { symbol: "Ss", name: "Suicide Silence", origin: "United States", year: 2002, category: "transition", row: 6, col: 4 },
  { symbol: "Jb", name: "Job for a Cowboy", origin: "United States", year: 2003, category: "transition", row: 6, col: 5 },
  { symbol: "Cx", name: "Carnifex", origin: "United States", year: 2005, category: "transition", row: 6, col: 6 },
  { symbol: "Al", name: "As I Lay Dying", origin: "United States", year: 2000, category: "transition", row: 6, col: 7 },
  { symbol: "Ke", name: "Killswitch Engage", origin: "United States", year: 1999, category: "transition", row: 6, col: 8 },
  { symbol: "Ar", name: "All That Remains", origin: "United States", year: 1998, category: "transition", row: 6, col: 9 },
  { symbol: "Pw", name: "Parkway Drive", origin: "Australia", year: 2003, category: "transition", row: 6, col: 10 },
  { symbol: "Ab", name: "August Burns Red", origin: "United States", year: 2003, category: "transition", row: 6, col: 11 },
  { symbol: "Bv", name: "Bullet for My Valentine", origin: "United Kingdom", year: 1998, category: "transition", row: 6, col: 12 },
  
  { symbol: "Tv", name: "Trivium", origin: "United States", year: 1999, category: "transition", row: 7, col: 3 },
  { symbol: "Aa", name: "Asking Alexandria", origin: "United Kingdom", year: 2008, category: "transition", row: 7, col: 4 },
  { symbol: "Om", name: "Of Mice & Men", origin: "United States", year: 2009, category: "transition", row: 7, col: 5 },
  { symbol: "Mi", name: "Miss May I", origin: "United States", year: 2007, category: "transition", row: 7, col: 6 },
  { symbol: "Wr", name: "We Came as Romans", origin: "United States", year: 2005, category: "transition", row: 7, col: 7 },
  { symbol: "Bm", name: "Bring Me the Horizon", origin: "United Kingdom", year: 2004, category: "transition", row: 7, col: 8 },
  { symbol: "Ac", name: "Architects", origin: "United Kingdom", year: 2004, category: "transition", row: 7, col: 9 },
  { symbol: "Dr", name: "A Day to Remember", origin: "United States", year: 2003, category: "transition", row: 7, col: 10 },
  { symbol: "Pv", name: "Pierce the Veil", origin: "United States", year: 2006, category: "transition", row: 7, col: 11 },
  { symbol: "Sw", name: "Sleeping with Sirens", origin: "United States", year: 2009, category: "transition", row: 7, col: 12 },
  
  // Extreme Metals (Blue) - Bottom rows 8-10
  { symbol: "Ul", name: "Ulver", origin: "Norway", year: 1993, category: "extreme", row: 8, col: 1 },
  { symbol: "Em", name: "Emperor", origin: "Norway", year: 1991, category: "extreme", row: 8, col: 2 },
  { symbol: "Bz", name: "Burzum", origin: "Norway", year: 1991, category: "extreme", row: 8, col: 3 },
  { symbol: "Bs", name: "Black Sabbath", origin: "United Kingdom", year: 1968, category: "extreme", row: 8, col: 4 },
  { symbol: "My", name: "Mayhem", origin: "Norway", year: 1984, category: "extreme", row: 8, col: 5 },
  { symbol: "Ba", name: "Bathory", origin: "Sweden", year: 1983, category: "extreme", row: 8, col: 6 },
  { symbol: "Mf", name: "Mercyful Fate", origin: "Denmark", year: 1981, category: "extreme", row: 8, col: 7 },
  { symbol: "Dr", name: "Darkthrone", origin: "Norway", year: 1986, category: "extreme", row: 8, col: 8 },
  { symbol: "Il", name: "Immortal", origin: "Norway", year: 1990, category: "extreme", row: 8, col: 9 },
  { symbol: "Sy", name: "Satyricon", origin: "Norway", year: 1991, category: "extreme", row: 8, col: 10 },
  { symbol: "Gg", name: "Gorgoroth", origin: "Norway", year: 1992, category: "extreme", row: 8, col: 11 },
  { symbol: "Db", name: "Dimmu Borgir", origin: "Norway", year: 1993, category: "extreme", row: 8, col: 12 },
  { symbol: "Cf", name: "Cradle of Filth", origin: "United Kingdom", year: 1991, category: "extreme", row: 8, col: 13 },
  { symbol: "Da", name: "Dark Funeral", origin: "Sweden", year: 1993, category: "extreme", row: 8, col: 14 },
  { symbol: "Mr", name: "Marduk", origin: "Sweden", year: 1990, category: "extreme", row: 8, col: 15 },
  { symbol: "Rg", name: "Ragnarok", origin: "Norway", year: 1994, category: "extreme", row: 8, col: 16 },
  { symbol: "Nd", name: "Napalm Death", origin: "United Kingdom", year: 1981, category: "extreme", row: 8, col: 17 },
  { symbol: "Ne", name: "Neurosis", origin: "United States", year: 1985, category: "extreme", row: 8, col: 18 },
  
  { symbol: "Cr", name: "Carcass", origin: "United Kingdom", year: 1985, category: "extreme", row: 9, col: 1 },
  { symbol: "Do", name: "Deathspell Omega", origin: "France", year: 1998, category: "extreme", row: 9, col: 2 },
  { symbol: "Dh", name: "Dødheimsgard", origin: "Norway", year: 1994, category: "extreme", row: 9, col: 3 },
  { symbol: "At", name: "Arcturus", origin: "Norway", year: 1987, category: "extreme", row: 9, col: 4 },
  { symbol: "If", name: "In Flames", origin: "Sweden", year: 1990, category: "extreme", row: 9, col: 5 },
  { symbol: "Ag", name: "At the Gates", origin: "Sweden", year: 1990, category: "extreme", row: 9, col: 6 },
  { symbol: "Ae", name: "Arch Enemy", origin: "Sweden", year: 1996, category: "extreme", row: 9, col: 7 },
  { symbol: "Cb", name: "Children of Bodom", origin: "Finland", year: 1993, category: "extreme", row: 9, col: 8 },
  { symbol: "En", name: "Entombed", origin: "Sweden", year: 1987, category: "extreme", row: 9, col: 9 },
  { symbol: "Ds", name: "Dismember", origin: "Sweden", year: 1988, category: "extreme", row: 9, col: 10 },
  { symbol: "Un", name: "Unleashed", origin: "Sweden", year: 1989, category: "extreme", row: 9, col: 11 },
  { symbol: "Gr", name: "Grave", origin: "Sweden", year: 1988, category: "extreme", row: 9, col: 12 },
  { symbol: "Wn", name: "Watain", origin: "Sweden", year: 1998, category: "extreme", row: 9, col: 13 },
  { symbol: "Be", name: "Behemoth", origin: "Poland", year: 1991, category: "extreme", row: 9, col: 14 },
  { symbol: "Bl", name: "Bloodbath", origin: "Sweden", year: 1998, category: "extreme", row: 9, col: 15 },
  { symbol: "Op", name: "Opeth", origin: "Sweden", year: 1990, category: "extreme", row: 9, col: 16 },
  { symbol: "Am", name: "Amon Amarth", origin: "Sweden", year: 1992, category: "extreme", row: 9, col: 17 },
  { symbol: "So", name: "Soilwork", origin: "Sweden", year: 1995, category: "extreme", row: 9, col: 18 },
  
  { symbol: "Ps", name: "Possessed", origin: "United States", year: 1983, category: "extreme", row: 10, col: 1 },
  { symbol: "Vr", name: "Vital Remains", origin: "United States", year: 1988, category: "extreme", row: 10, col: 2 },
  { symbol: "Gd", name: "God Dethroned", origin: "Netherlands", year: 1991, category: "extreme", row: 10, col: 3 },
  { symbol: "Vl", name: "Vader", origin: "Poland", year: 1983, category: "extreme", row: 10, col: 4 },
  { symbol: "De", name: "Decapitated", origin: "Poland", year: 1996, category: "extreme", row: 10, col: 5 },
  { symbol: "Hb", name: "Hatebreed", origin: "United States", year: 1994, category: "extreme", row: 10, col: 6 },
  { symbol: "Lg", name: "Lamb of God", origin: "United States", year: 1994, category: "extreme", row: 10, col: 7 },
  { symbol: "Ch", name: "Chimaira", origin: "United States", year: 1998, category: "extreme", row: 10, col: 8 },
  { symbol: "Dh", name: "DevilDriver", origin: "United States", year: 2002, category: "extreme", row: 10, col: 9 },
  { symbol: "Hk", name: "Hate Eternal", origin: "United States", year: 1997, category: "extreme", row: 10, col: 10 },
  { symbol: "Mo", name: "Moonsorrow", origin: "Finland", year: 1995, category: "extreme", row: 10, col: 11 },
  { symbol: "Eh", name: "Ensiferum", origin: "Finland", year: 1995, category: "extreme", row: 10, col: 12 },
  { symbol: "Wn", name: "Wintersun", origin: "Finland", year: 2003, category: "extreme", row: 10, col: 13 },
  { symbol: "Tk", name: "Korpiklaani", origin: "Finland", year: 1993, category: "extreme", row: 10, col: 14 },
  { symbol: "Ft", name: "Finntroll", origin: "Finland", year: 1997, category: "extreme", row: 10, col: 15 },
  { symbol: "El", name: "Eluveitie", origin: "Switzerland", year: 2002, category: "extreme", row: 10, col: 16 },
  { symbol: "Ta", name: "Turisas", origin: "Finland", year: 1997, category: "extreme", row: 10, col: 17 },
  { symbol: "Af", name: "Alef", origin: "Finland", year: 1995, category: "extreme", row: 10, col: 18 },
];

export const getBandAtPosition = (row: number, col: number): Band | undefined => {
  return bands.find(band => band.row === row && band.col === col);
};

export const getMaxRow = (): number => {
  return Math.max(...bands.map(b => b.row));
};
