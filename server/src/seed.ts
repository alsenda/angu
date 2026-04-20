import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from './lib/prisma';

async function main() {
  console.log('Seeding database...');

  const tenant = await prisma.tenant.upsert({
    where: { slug: 'autoescuela-angu' },
    update: {},
    create: {
      name: 'Autoescuela Angu',
      slug: 'autoescuela-angu',
      primaryColor: '#2563EB',
      city: 'Sanlúcar de Barrameda, Cádiz',
      phone: '658 09 34 20',
      email: 'autoescuelaangu@gmail.com',
    },
  });

  const adminPass = await bcrypt.hash('admin123', 10);
  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'admin@autoescuelaangu.com' } },
    update: {},
    create: { name: 'Angu Admin', email: 'admin@autoescuelaangu.com', password: adminPass, tenantId: tenant.id, role: 'ADMIN' },
  });

  const adminSimplePass = await bcrypt.hash('admin', 10);
  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'admin@angu.com' } },
    update: { password: adminSimplePass },
    create: { name: 'Admin', email: 'admin@angu.com', password: adminSimplePass, tenantId: tenant.id, role: 'ADMIN' },
  });

  const studentPass = await bcrypt.hash('student123', 10);
  await prisma.user.upsert({
    where: { tenantId_email: { tenantId: tenant.id, email: 'alumno@test.com' } },
    update: {},
    create: { name: 'Alumno Demo', email: 'alumno@test.com', password: studentPass, tenantId: tenant.id },
  });

  const course1 = await prisma.course.upsert({
    where: { id: 'course-teoria-general' },
    update: {},
    create: {
      id: 'course-teoria-general',
      tenantId: tenant.id,
      title: 'Teoría General de Conducción',
      description: 'Aprende los fundamentos del código de la circulación, señales de tráfico y normas básicas de conducción para el examen teórico.',
      order: 0,
    },
  });

  const course2 = await prisma.course.upsert({
    where: { id: 'course-senales' },
    update: {},
    create: {
      id: 'course-senales',
      tenantId: tenant.id,
      title: 'Señales de Tráfico',
      description: 'Domina todas las señales de tráfico: verticales, horizontales, semáforos y señales de los agentes.',
      order: 1,
    },
  });

  const course3 = await prisma.course.upsert({
    where: { id: 'course-mecanica' },
    update: {},
    create: {
      id: 'course-mecanica',
      tenantId: tenant.id,
      title: 'Mecánica y Seguridad Vial',
      description: 'Conoce el funcionamiento básico del vehículo, mantenimiento preventivo y técnicas de conducción segura.',
      order: 2,
    },
  });

  const lessons1 = [
    { title: 'Introducción al código de circulación', description: 'Visión general del reglamento general de circulación y su importancia.' },
    { title: 'Normas de preferencia de paso', description: 'Quién tiene preferencia en intersecciones, rotondas y situaciones especiales.' },
    { title: 'Velocidades máximas y mínimas', description: 'Límites de velocidad según el tipo de vía y las condiciones de circulación.' },
    { title: 'Distancias de seguridad', description: 'Cómo calcular la distancia de seguridad y la distancia de frenado.' },
    { title: 'Adelantamiento', description: 'Reglas para adelantar correctamente y cuándo está prohibido.' },
    { title: 'Uso de luces y alumbrado', description: 'Cuándo y cómo usar los distintos sistemas de iluminación del vehículo.' },
  ];

  for (let i = 0; i < lessons1.length; i++) {
    await prisma.lesson.upsert({
      where: { id: `lesson-tg-${i}` },
      update: {},
      create: { id: `lesson-tg-${i}`, courseId: course1.id, ...lessons1[i], duration: 600 + i * 120, order: i },
    });
  }

  const lessons2 = [
    { title: 'Señales de advertencia de peligro', description: 'Señales triangulares que avisan de peligros próximos en la calzada.' },
    { title: 'Señales de reglamentación', description: 'Señales que regulan la circulación: prohibición, obligación y prioridad.' },
    { title: 'Señales de indicación', description: 'Señales informativas: servicios, orientación, localización.' },
    { title: 'Marcas viales horizontales', description: 'Líneas continuas, discontinuas, pasos de peatones y otras marcas.' },
    { title: 'Semáforos y su interpretación', description: 'Cómo interpretar los distintos tipos de semáforos y sus fases.' },
  ];

  for (let i = 0; i < lessons2.length; i++) {
    await prisma.lesson.upsert({
      where: { id: `lesson-s-${i}` },
      update: {},
      create: { id: `lesson-s-${i}`, courseId: course2.id, ...lessons2[i], duration: 480 + i * 90, order: i },
    });
  }

  const test1 = await prisma.test.upsert({
    where: { id: 'test-teoria-1' },
    update: {},
    create: {
      id: 'test-teoria-1',
      courseId: course1.id,
      title: 'Test de Teoría General',
      description: 'Evalúa tus conocimientos sobre las normas básicas de circulación.',
      timeLimit: 30,
      passingScore: 70,
    },
  });

  const questions = [
    {
      text: '¿Cuál es la velocidad máxima en autopistas para turismos?',
      options: [{ id: 'a', text: '100 km/h' }, { id: 'b', text: '110 km/h' }, { id: 'c', text: '120 km/h' }, { id: 'd', text: '130 km/h' }],
      correctAnswer: 'd',
      explanation: 'En autopistas y autovías, la velocidad máxima para turismos es de 120 km/h. En circunstancias especiales puede elevarse a 130 km/h.',
    },
    {
      text: '¿Qué indica una línea continua en el centro de la calzada?',
      options: [{ id: 'a', text: 'Está prohibido adelantar o cambiar de carril' }, { id: 'b', text: 'Se puede adelantar con precaución' }, { id: 'c', text: 'Fin de prohibición de adelantamiento' }, { id: 'd', text: 'Calzada de doble sentido' }],
      correctAnswer: 'a',
      explanation: 'La línea longitudinal continua en el centro de la calzada prohíbe cruzarla o bordearla para adelantar o cambiar de sentido.',
    },
    {
      text: 'En una intersección sin señalizar, dos vehículos llegan al mismo tiempo. ¿Cuál tiene preferencia?',
      options: [{ id: 'a', text: 'El que viene por la izquierda' }, { id: 'b', text: 'El que viene por la derecha' }, { id: 'c', text: 'El que lleva más velocidad' }, { id: 'd', text: 'El vehículo mayor' }],
      correctAnswer: 'b',
      explanation: 'En intersecciones sin señalizar, tiene preferencia el vehículo que se aproxima por la derecha.',
    },
    {
      text: '¿Cuándo es obligatorio el uso del cinturón de seguridad?',
      options: [{ id: 'a', text: 'Solo en autopistas' }, { id: 'b', text: 'Solo el conductor' }, { id: 'c', text: 'Siempre, tanto el conductor como los pasajeros' }, { id: 'd', text: 'Solo en carreteras de alta velocidad' }],
      correctAnswer: 'c',
      explanation: 'El uso del cinturón de seguridad es obligatorio para todos los ocupantes del vehículo en todas las vías, salvo excepciones reglamentarias.',
    },
    {
      text: '¿Qué distancia mínima de seguridad debes mantener en autovía a 100 km/h?',
      options: [{ id: 'a', text: '50 metros' }, { id: 'b', text: '70 metros' }, { id: 'c', text: '100 metros' }, { id: 'd', text: 'La que permita detenerse en caso de frenada brusca' }],
      correctAnswer: 'd',
      explanation: 'La ley no establece una distancia fija, sino que debe ser la suficiente para poder detener el vehículo en caso de frenada brusca del de delante.',
    },
    {
      text: '¿Qué significa la señal de un triángulo con una exclamación?',
      options: [{ id: 'a', text: 'Stop obligatorio' }, { id: 'b', text: 'Ceda el paso' }, { id: 'c', text: 'Peligro, otros peligros' }, { id: 'd', text: 'Prohibición genérica' }],
      correctAnswer: 'c',
      explanation: 'El triángulo con signo de exclamación indica "otros peligros" no específicamente señalizados.',
    },
    {
      text: '¿En qué circunstancias está permitido usar el móvil mientras conduces?',
      options: [{ id: 'a', text: 'Con manos libres' }, { id: 'b', text: 'Solo en semáforo en rojo' }, { id: 'c', text: 'Nunca mientras el motor está en marcha' }, { id: 'd', text: 'Solo llamadas cortas' }],
      correctAnswer: 'a',
      explanation: 'Está permitido usar el teléfono con un sistema de manos libres que no requiera sujetarlo ni manipularlo mientras se conduce.',
    },
    {
      text: '¿Qué color tienen las señales de servicios?',
      options: [{ id: 'a', text: 'Azul' }, { id: 'b', text: 'Verde' }, { id: 'c', text: 'Amarillo' }, { id: 'd', text: 'Blanco' }],
      correctAnswer: 'a',
      explanation: 'Las señales de servicios (hospitales, gasolineras, etc.) tienen fondo azul.',
    },
    {
      text: '¿Cuándo debes ceder el paso en una rotonda?',
      options: [{ id: 'a', text: 'Nunca, la rotonda siempre tiene prioridad' }, { id: 'b', text: 'Al entrar en la rotonda, cedes a los que ya están dentro' }, { id: 'c', text: 'Al salir de la rotonda' }, { id: 'd', text: 'Solo si hay señal de ceda el paso' }],
      correctAnswer: 'b',
      explanation: 'En las rotondas, los vehículos que circulan por el interior tienen preferencia sobre los que pretenden entrar.',
    },
    {
      text: '¿Qué significa el semáforo en ámbar fijo?',
      options: [{ id: 'a', text: 'Acelera para pasar antes del rojo' }, { id: 'b', text: 'Prepárate para avanzar' }, { id: 'c', text: 'Detente si puedes hacerlo con seguridad' }, { id: 'd', text: 'Prohibición de circular' }],
      correctAnswer: 'c',
      explanation: 'El semáforo ámbar indica que la luz roja está a punto de encenderse. Debes detenerte si puedes hacerlo de forma segura.',
    },
  ];

  for (let i = 0; i < questions.length; i++) {
    await prisma.question.upsert({
      where: { id: `q-t1-${i}` },
      update: {},
      create: {
        id: `q-t1-${i}`,
        testId: test1.id,
        text: questions[i].text,
        options: JSON.stringify(questions[i].options),
        correctAnswer: questions[i].correctAnswer,
        explanation: questions[i].explanation,
        order: i,
      },
    });
  }

  const test2 = await prisma.test.upsert({
    where: { id: 'test-senales-1' },
    update: {},
    create: {
      id: 'test-senales-1',
      courseId: course2.id,
      title: 'Test de Señales de Tráfico',
      description: 'Identifica y comprende las señales de tráfico más importantes.',
      timeLimit: 20,
      passingScore: 70,
    },
  });

  const senalQuestions = [
    {
      text: '¿Qué forma tienen las señales de prohibición?',
      options: [{ id: 'a', text: 'Triangulares con borde rojo' }, { id: 'b', text: 'Circulares con fondo blanco y borde rojo' }, { id: 'c', text: 'Cuadradas con fondo azul' }, { id: 'd', text: 'Octogonales con fondo rojo' }],
      correctAnswer: 'b',
      explanation: 'Las señales de prohibición son circulares con fondo blanco y borde rojo. Excepto la señal de Stop que es octogonal.',
    },
    {
      text: '¿Qué indica la señal de Stop?',
      options: [{ id: 'a', text: 'Reduce la velocidad' }, { id: 'b', text: 'Cede el paso' }, { id: 'c', text: 'Detención obligatoria' }, { id: 'd', text: 'Zona de obras' }],
      correctAnswer: 'c',
      explanation: 'La señal de STOP obliga a detenerse completamente antes de la línea de stop o la intersección.',
    },
    {
      text: '¿Qué color de fondo tienen las señales de autopista?',
      options: [{ id: 'a', text: 'Blanco' }, { id: 'b', text: 'Verde' }, { id: 'c', text: 'Azul' }, { id: 'd', text: 'Amarillo' }],
      correctAnswer: 'c',
      explanation: 'Las señales de dirección en autopistas tienen fondo azul, mientras que en carreteras convencionales son de fondo blanco o verde.',
    },
    {
      text: '¿Qué significa la línea de stop pintada en el suelo?',
      options: [{ id: 'a', text: 'Paso de peatones' }, { id: 'b', text: 'Límite donde debes detenerte antes de la intersección' }, { id: 'c', text: 'Cambio de carril permitido' }, { id: 'd', text: 'Zona de aparcamiento' }],
      correctAnswer: 'b',
      explanation: 'La línea de stop indica el punto exacto donde el vehículo debe detenerse cuando haya una señal de Stop o semáforo en rojo.',
    },
    {
      text: '¿Qué significa una señal circular azul con una flecha blanca?',
      options: [{ id: 'a', text: 'Prohibición de girar' }, { id: 'b', text: 'Dirección obligatoria' }, { id: 'c', text: 'Carretera de sentido único' }, { id: 'd', text: 'Vía de preferencia' }],
      correctAnswer: 'b',
      explanation: 'Las señales circulares de fondo azul con flechas blancas indican obligación de seguir la dirección marcada.',
    },
  ];

  for (let i = 0; i < senalQuestions.length; i++) {
    await prisma.question.upsert({
      where: { id: `q-s1-${i}` },
      update: {},
      create: {
        id: `q-s1-${i}`,
        testId: test2.id,
        text: senalQuestions[i].text,
        options: JSON.stringify(senalQuestions[i].options),
        correctAnswer: senalQuestions[i].correctAnswer,
        explanation: senalQuestions[i].explanation,
        order: i,
      },
    });
  }

  console.log('Seed complete!');
  console.log('  Tenant:', tenant.slug);
  console.log('  Admin:  admin@autoescuelaangu.com / admin123');
  console.log('  Student: alumno@test.com / student123');
}

main().catch(console.error).finally(() => prisma.$disconnect());
