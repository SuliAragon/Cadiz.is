export interface QuizOption {
  id: string;
  text: string;
  isCorrect?: boolean;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  explanation: string;
}

const questions: Record<string, QuizQuestion[]> = {
  es: [
    {
      question: '¿Qué se entiende popularmente por "tacita de plata" cuando se habla de Cádiz?',
      options: [
        { id: 'A', text: 'El vaso donde se bebe el vino de Jerez' },
        { id: 'B', text: 'El estadio del Cádiz C.F.' },
        { id: 'C', text: 'El casco histórico de Cádiz visto desde el mar', isCorrect: true },
        { id: 'D', text: 'Un apodo para la Torre Tavira' },
      ],
      explanation: 'La expresión "tacita de plata" se refiere al casco histórico de Cádiz visto desde el mar, con sus murallas y casas claras brillando sobre el Atlántico.',
    },
    {
      question: 'En el carnaval de Cádiz, ¿qué es una chirigota?',
      options: [
        { id: 'A', text: 'El nombre de las carrozas principales del desfile' },
        { id: 'B', text: 'Un tipo de disfraz típico de Semana Santa' },
        { id: 'C', text: 'Un concurso de bailes tradicionales' },
        { id: 'D', text: 'Un grupo que canta coplas humorísticas y críticas', isCorrect: true },
      ],
      explanation: 'Una chirigota es un grupo que canta coplas humorísticas y críticas, normalmente con letras muy ingeniosas y de actualidad.',
    },
    {
      question: '¿Qué significa que algo es "muy gadita"?',
      options: [
        { id: 'A', text: 'Que está relacionado con el flamenco de Sevilla' },
        { id: 'B', text: 'Que es muy propio y auténtico de Cádiz', isCorrect: true },
        { id: 'C', text: 'Que está cerca de la playa de La Concha' },
        { id: 'D', text: 'Que es típico de la gastronomía vasca' },
      ],
      explanation: 'Decir que algo es "muy gadita" significa que es muy propio y auténtico de Cádiz, que destila la esencia local.',
    },
    {
      question: '¿Cuál de estos platos se asocia especialmente a Cádiz y su bahía?',
      options: [
        { id: 'A', text: 'Pulpo á feira' },
        { id: 'B', text: 'Cocido madrileño' },
        { id: 'C', text: 'Paella valenciana' },
        { id: 'D', text: 'Tortillitas de camarones', isCorrect: true },
      ],
      explanation: 'Las tortillitas de camarones son uno de los platos más representativos de Cádiz y su bahía.',
    },
    {
      question: '¿Qué son los "cai, cai" que se oyen en un estadio cuando juega el Cádiz C.F.?',
      options: [
        { id: 'A', text: 'Una protesta contra el árbitro' },
        { id: 'B', text: 'El nombre de la mascota oficial' },
        { id: 'C', text: 'Un insulto al equipo rival' },
        { id: 'D', text: 'Un grito de guerra cariñoso de apoyo al equipo', isCorrect: true },
      ],
      explanation: 'El "cai, cai" es un grito de guerra cariñoso de apoyo al equipo. El acento gaditano transforma "Cádiz" en "Cai".',
    },
    {
      question: 'En el imaginario gaditano, ¿qué se suele exagerar en los chistes sobre Cádiz?',
      options: [
        { id: 'A', text: 'La afición por las grandes montañas nevadas' },
        { id: 'B', text: 'La seriedad extrema de la gente' },
        { id: 'C', text: 'El clima frío y lluvioso durante todo el año' },
        { id: 'D', text: 'La gracia, el cachondeo y el buen humor', isCorrect: true },
      ],
      explanation: 'La gracia, el cachondeo y el buen humor son los rasgos que más se suelen exagerar en los chistes sobre Cádiz.',
    },
    {
      question: '¿Qué papel tiene el Teatro Falla en el carnaval de Cádiz?',
      options: [
        { id: 'A', text: 'Es un edificio administrativo sin relación con el carnaval' },
        { id: 'B', text: 'Es un teatro exclusivo para ópera clásica' },
        { id: 'C', text: 'Es solo un museo dedicado a la historia romana' },
        { id: 'D', text: 'Es el escenario principal del concurso oficial de agrupaciones', isCorrect: true },
      ],
      explanation: 'El Teatro Falla es el escenario principal del concurso oficial de agrupaciones del carnaval de Cádiz.',
    },
    {
      question: '¿Qué curiosa relación se suele mencionar entre Cádiz y las puestas de sol?',
      options: [
        { id: 'A', text: 'Que está prohibido ver la puesta de sol en la ciudad' },
        { id: 'B', text: 'Que casi nunca se ve el sol por la niebla' },
        { id: 'C', text: 'Que la gente aplaude algunas puestas de sol desde la playa', isCorrect: true },
        { id: 'D', text: 'Que solo se puede ver desde barcos privados' },
      ],
      explanation: 'En playas como La Caleta, la gente aplaude la puesta de sol como si se despidiera al sol después de una buena función teatral.',
    },
    {
      question: 'En el habla coloquial gaditana, ¿qué significa decir "illo" o "illo, qué pasa"?',
      options: [
        { id: 'A', text: 'Es una forma cercana de llamar la atención, como decir "tío" o "oye"', isCorrect: true },
        { id: 'B', text: 'Es un insulto muy grave' },
        { id: 'C', text: 'Es una fórmula mágica del carnaval' },
        { id: 'D', text: 'Es una expresión exclusiva de presentadores de televisión' },
      ],
      explanation: 'Decir "illo" es una forma cercana de llamar la atención, parecida a decir "tío" u "oye" en un registro muy coloquial.',
    },
    {
      question: '¿Qué imagen tópica se asocia a la playa de La Caleta en postales y canciones gaditanas?',
      options: [
        { id: 'A', text: 'Una gran playa urbana rodeada de rascacielos modernos' },
        { id: 'B', text: 'Una playa industrial llena de contenedores' },
        { id: 'C', text: 'Una playa pequeña, con barquitos y castillos a los lados', isCorrect: true },
        { id: 'D', text: 'Una playa cubierta de nieve en invierno' },
      ],
      explanation: 'La playa de La Caleta se representa como una playa pequeña y recogida, llena de barquitos y flanqueada por castillos a los lados.',
    },
  ],

  en: [
    {
      question: 'What does "tacita de plata" (little silver cup) refer to when talking about Cádiz?',
      options: [
        { id: 'A', text: 'The glass used to drink Jerez wine' },
        { id: 'B', text: 'The Cádiz C.F. stadium' },
        { id: 'C', text: 'The historic old town of Cádiz as seen from the sea', isCorrect: true },
        { id: 'D', text: 'A nickname for the Torre Tavira' },
      ],
      explanation: '"Tacita de plata" refers to the historic old town of Cádiz as seen from the sea, its white walls and houses gleaming over the Atlantic.',
    },
    {
      question: 'At the Cádiz Carnival, what is a chirigota?',
      options: [
        { id: 'A', text: 'The name of the main floats in the parade' },
        { id: 'B', text: 'A type of costume worn during Holy Week' },
        { id: 'C', text: 'A traditional dance competition' },
        { id: 'D', text: 'A group that performs humorous and satirical songs', isCorrect: true },
      ],
      explanation: 'A chirigota is a group that performs humorous and satirical songs, usually with sharp, topical lyrics.',
    },
    {
      question: 'What does it mean when something is described as "muy gadita"?',
      options: [
        { id: 'A', text: 'That it is related to Seville flamenco' },
        { id: 'B', text: 'That it is truly authentic and typical of Cádiz', isCorrect: true },
        { id: 'C', text: 'That it is near La Concha beach' },
        { id: 'D', text: 'That it belongs to Basque cuisine' },
      ],
      explanation: '"Muy gadita" means something is truly authentic and deeply rooted in Cádiz\'s culture.',
    },
    {
      question: 'Which dish is especially associated with Cádiz and its bay?',
      options: [
        { id: 'A', text: 'Galician octopus (pulpo á feira)' },
        { id: 'B', text: 'Madrid-style chickpea stew (cocido madrileño)' },
        { id: 'C', text: 'Valencian paella' },
        { id: 'D', text: 'Shrimp fritters (tortillitas de camarones)', isCorrect: true },
      ],
      explanation: 'Shrimp fritters (tortillitas de camarones) are one of the most iconic dishes of Cádiz and its bay.',
    },
    {
      question: 'What are the "cai, cai" chants heard in the stadium when Cádiz C.F. plays?',
      options: [
        { id: 'A', text: 'A protest against the referee' },
        { id: 'B', text: 'The name of the club\'s official mascot' },
        { id: 'C', text: 'An insult aimed at the opposing team' },
        { id: 'D', text: 'An affectionate battle cry of support for the team', isCorrect: true },
      ],
      explanation: '"Cai, cai" is an affectionate battle cry. In the Cádiz accent, "Cádiz" becomes "Cai".',
    },
    {
      question: 'What trait is most often exaggerated in jokes about Cádiz?',
      options: [
        { id: 'A', text: 'A love of snowy mountains' },
        { id: 'B', text: 'An extreme seriousness among the people' },
        { id: 'C', text: 'A cold and rainy climate all year round' },
        { id: 'D', text: 'Wit, irreverence, and a great sense of humour', isCorrect: true },
      ],
      explanation: 'Wit, irreverence, and a great sense of humour are the traits most often exaggerated in jokes about Cádiz.',
    },
    {
      question: 'What role does the Teatro Falla play in the Cádiz Carnival?',
      options: [
        { id: 'A', text: 'It is an administrative building with no connection to carnival' },
        { id: 'B', text: 'It is a classical opera house with no carnival use' },
        { id: 'C', text: 'It is only a museum of Roman history' },
        { id: 'D', text: 'It is the main stage of the official competition of groups', isCorrect: true },
      ],
      explanation: 'The Teatro Falla is the main stage of the Official Competition of Carnival Groups.',
    },
    {
      question: 'What curious tradition is associated with sunsets in Cádiz?',
      options: [
        { id: 'A', text: 'Watching the sunset is forbidden inside the city' },
        { id: 'B', text: 'The sun is rarely seen due to constant fog' },
        { id: 'C', text: 'People applaud the sunset from the beach', isCorrect: true },
        { id: 'D', text: 'Sunsets can only be seen from private boats' },
      ],
      explanation: 'On beaches like La Caleta, locals and visitors applaud the sunset as if bidding farewell after a great performance.',
    },
    {
      question: 'In local Cádiz slang, what does saying "illo" mean?',
      options: [
        { id: 'A', text: 'A casual way of getting someone\'s attention, like "mate" or "hey"', isCorrect: true },
        { id: 'B', text: 'A very serious insult' },
        { id: 'C', text: 'A magical carnival phrase' },
        { id: 'D', text: 'An expression used only by TV presenters' },
      ],
      explanation: '"Illo" is a casual, affectionate way of getting someone\'s attention, similar to "mate" or "hey".',
    },
    {
      question: 'What iconic image is associated with La Caleta beach in postcards and songs about Cádiz?',
      options: [
        { id: 'A', text: 'A large urban beach surrounded by modern skyscrapers' },
        { id: 'B', text: 'An industrial beach full of shipping containers' },
        { id: 'C', text: 'A small beach flanked by castles, with little fishing boats', isCorrect: true },
        { id: 'D', text: 'A snow-covered beach in winter' },
      ],
      explanation: 'La Caleta is typically pictured as a small, intimate beach flanked by two castles with little fishing boats resting on the sand.',
    },
  ],

  fr: [
    {
      question: 'Que désigne l\'expression "tacita de plata" (petite tasse en argent) à propos de Cadix ?',
      options: [
        { id: 'A', text: 'Le verre dans lequel on boit le vin de Jerez' },
        { id: 'B', text: 'Le stade du Cádiz C.F.' },
        { id: 'C', text: 'Le centre historique de Cadix vu depuis la mer', isCorrect: true },
        { id: 'D', text: 'Un surnom pour la Torre Tavira' },
      ],
      explanation: '"Tacita de plata" désigne le centre historique de Cadix vu depuis la mer, avec ses remparts et ses maisons blanches brillant sur l\'Atlantique.',
    },
    {
      question: 'Au carnaval de Cadix, qu\'est-ce qu\'une chirigota ?',
      options: [
        { id: 'A', text: 'Le nom des chars principaux du défilé' },
        { id: 'B', text: 'Un type de costume typique de la Semaine Sainte' },
        { id: 'C', text: 'Un concours de danses traditionnelles' },
        { id: 'D', text: 'Un groupe qui chante des couplets humoristiques et satiriques', isCorrect: true },
      ],
      explanation: 'Une chirigota est un groupe qui interprète des couplets humoristiques et satiriques, avec des paroles très ingénieuses.',
    },
    {
      question: 'Que signifie dire que quelque chose est "muy gadita" ?',
      options: [
        { id: 'A', text: 'Que cela est lié au flamenco de Séville' },
        { id: 'B', text: 'Que c\'est très authentique et typique de Cadix', isCorrect: true },
        { id: 'C', text: 'Que c\'est près de la plage de La Concha' },
        { id: 'D', text: 'Que c\'est typique de la gastronomie basque' },
      ],
      explanation: '"Muy gadita" signifie que c\'est authentiquement ancré dans la culture de Cadix.',
    },
    {
      question: 'Quel plat est particulièrement associé à Cadix et à sa baie ?',
      options: [
        { id: 'A', text: 'Poulpe à la galicienne (pulpo á feira)' },
        { id: 'B', text: 'Pot-au-feu madrilène (cocido madrileño)' },
        { id: 'C', text: 'Paella valencienne' },
        { id: 'D', text: 'Galettes de crevettes (tortillitas de camarones)', isCorrect: true },
      ],
      explanation: 'Les galettes de crevettes sont l\'un des plats les plus emblématiques de Cadix et de sa baie.',
    },
    {
      question: 'Que sont les « cai, cai » que l\'on entend dans le stade quand joue le Cádiz C.F. ?',
      options: [
        { id: 'A', text: 'Une protestation contre l\'arbitre' },
        { id: 'B', text: 'Le nom de la mascotte officielle du club' },
        { id: 'C', text: 'Une insulte à l\'équipe adverse' },
        { id: 'D', text: 'Un cri de ralliement affectueux pour soutenir l\'équipe', isCorrect: true },
      ],
      explanation: '« Cai, cai » est un cri de ralliement affectueux. Dans l\'accent gaditano, « Cádiz » devient « Cai ».',
    },
    {
      question: 'Quel trait est le plus souvent exagéré dans les blagues sur Cadix ?',
      options: [
        { id: 'A', text: 'L\'amour des grandes montagnes enneigées' },
        { id: 'B', text: 'L\'extrême sérieux des habitants' },
        { id: 'C', text: 'Un climat froid et pluvieux toute l\'année' },
        { id: 'D', text: 'L\'esprit, l\'humour et la joie de vivre', isCorrect: true },
      ],
      explanation: 'L\'esprit, l\'humour et la joie de vivre sont les traits les plus souvent exagérés dans les blagues sur Cadix.',
    },
    {
      question: 'Quel rôle joue le Teatro Falla dans le carnaval de Cadix ?',
      options: [
        { id: 'A', text: 'C\'est un bâtiment administratif sans lien avec le carnaval' },
        { id: 'B', text: 'C\'est un théâtre d\'opéra classique sans usage carnavalesque' },
        { id: 'C', text: 'C\'est uniquement un musée d\'histoire romaine' },
        { id: 'D', text: 'C\'est la scène principale du concours officiel des groupes', isCorrect: true },
      ],
      explanation: 'Le Teatro Falla est la scène principale du Concours officiel des groupes de carnaval de Cadix.',
    },
    {
      question: 'Quelle curieuse tradition est associée aux couchers de soleil à Cadix ?',
      options: [
        { id: 'A', text: 'Il est interdit d\'observer le coucher de soleil en ville' },
        { id: 'B', text: 'Le soleil est rarement visible à cause du brouillard' },
        { id: 'C', text: 'Les gens applaudissent le coucher de soleil depuis la plage', isCorrect: true },
        { id: 'D', text: 'Le coucher de soleil ne se voit que depuis des bateaux privés' },
      ],
      explanation: 'Sur certaines plages comme La Caleta, habitants et visiteurs applaudissent le coucher de soleil.',
    },
    {
      question: 'Dans l\'argot local de Cadix, que signifie dire « illo » ?',
      options: [
        { id: 'A', text: 'Une façon familière d\'interpeller quelqu\'un, comme dire « mec » ou « hé »', isCorrect: true },
        { id: 'B', text: 'Une insulte très grave' },
        { id: 'C', text: 'Une formule magique du carnaval' },
        { id: 'D', text: 'Une expression réservée aux présentateurs de télévision' },
      ],
      explanation: '« Illo » est une interpellation familière et affectueuse, comparable à « mec » ou « hé ».',
    },
    {
      question: 'Quelle image emblématique est associée à la plage de La Caleta dans les cartes postales et chansons gaditanas ?',
      options: [
        { id: 'A', text: 'Une grande plage urbaine entourée de gratte-ciel modernes' },
        { id: 'B', text: 'Une plage industrielle remplie de conteneurs' },
        { id: 'C', text: 'Une petite plage flanquée de châteaux et de petits bateaux de pêche', isCorrect: true },
        { id: 'D', text: 'Une plage couverte de neige en hiver' },
      ],
      explanation: 'La Caleta est représentée comme une petite plage intime, flanquée de deux châteaux avec de petits bateaux de pêche sur le sable.',
    },
  ],
};

export default questions;
