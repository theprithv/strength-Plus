import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

const exercises = [
  {
    name: "Bench Press (Barbell)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00251201-Barbell-Bench-Press_Chest.mp4",
    howToSteps: [
      "Lie on the bench.",
      "Extend your arms and grab the bar evenly, having your hands slightly wider than shoulder-width apart.",
      "Bring your shoulder blades back and dig them into the bench.",
      "Arch your lower back and plant your feet flat on the floor.",
      "Take a breath, unrack the bar, and bring it over your chest.",
      "Inhale again and lower the barbell to your lower chest, tapping it slightly.",
      "Hold for a moment and press the bar until your elbows are straight. Exhale.",
    ],
    isCustom: false,
  },
  {
    name: "21s Bicep Curl",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["forearms"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00311201-Barbell-Curl_Upper-Arms.mp4",
    howToSteps: [
      "Stand tall holding a straight or EZ bar with an even grip.",
      "Pull your shoulders back, squeeze your glutes, and brace your core.",
      "Curl the bar from full arm extension to halfway up until your wrists align with your elbows for seven repetitions.",
      "Without resting, curl the bar from the halfway point to the top position for another seven repetitions.",
      "Finish with seven full repetitions from full extension to the top position while breathing steadily.",
    ],
    isCustom: false,
  },

  {
    name: "Ab Scissors",
    primaryMuscle: "Abdominals",
    secondaryMuscles: ["hip flexors"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/62141201-Lying-Scissors-Cross-(male)_Hips_.mp4",
    howToSteps: [
      "Sit on an exercise mat, lean back slightly, and place your hands on the floor beside you for balance.",
      "Engage your core and raise your legs a few inches off the floor while keeping your knees extended.",
      "Cross your right leg over your left, then immediately uncross and cross your left leg over your right.",
      "Continue alternating leg crosses while breathing steadily until the set is complete.",
    ],
    isCustom: false,
  },

  {
    name: "Ab Wheel",
    primaryMuscle: "Abdominals",
    secondaryMuscles: ["hip flexors", "lats"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/08571201-Wheel-Rollout_Waist.mp4",
    howToSteps: [
      "Kneel on the floor and grip the ab wheel firmly with both hands.",
      "Place the ab wheel on the floor directly under your shoulders.",
      "Engage your core and brace your abs before moving.",
      "Slowly roll the wheel forward as you extend your body, keeping your hips and spine stable.",
      "Roll forward as far as your core strength allows, then pull the wheel back to the starting position while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Air Bike",
    primaryMuscle: "Cardio",
    secondaryMuscles: ["quadriceps", "hamstrings", "glutes", "shoulders"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/38931101-Assault-Bike-Run_Cardio_small.jpg",
    howToSteps: [
      "Sit on the air bike and adjust the seat so your knees are slightly bent at the bottom of the pedal stroke.",
      "Place your feet on the pedals and grip the moving handles firmly.",
      "Begin pedaling while simultaneously pushing and pulling the handles with your arms.",
      "Maintain a steady rhythm or increase intensity depending on your training goal.",
      "Continue for the desired time or distance while breathing steadily.",
    ],
    isCustom: false,
  },

  {
    name: "Arnold Press (Dumbbell)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["triceps"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02871201-Dumbbell-Arnold-Press-II_Shoulders.mp4",
    howToSteps: [
      "Sit on a bench with an upright back support holding a pair of dumbbells.",
      "Rest the dumbbells on your thighs, then lift them to shoulder height with palms facing your body.",
      "Pull your shoulders back, engage your core, and brace your abs.",
      "Press the dumbbells upward while rotating your wrists so your palms face forward.",
      "Continue pressing until your arms are fully extended overhead while exhaling.",
      "Lower the dumbbells slowly, rotating your wrists inward so your palms face your body at the bottom.",
      "Repeat the press and rotation to complete each repetition.",
    ],
    isCustom: false,
  },

  {
    name: "Around The World",
    primaryMuscle: "Chest",
    secondaryMuscles: ["upper back", "shoulders", "lats"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02881201-Dumbbell-Around-Pullover_Chest.mp4",
    howToSteps: [
      "Lie flat on a bench holding a dumbbell in each hand.",
      "Position the dumbbells over your upper thighs with your arms straight and palms facing down.",
      "Pull your shoulders back, engage your core, and inhale.",
      "Slowly move the dumbbells in a wide arc from your thighs to behind your head while keeping your arms straight.",
      "Immediately reverse the arc to bring the dumbbells back to the starting position, rotating your wrists so your palms face down as you return.",
    ],
    isCustom: false,
  },

  {
    name: "Assisted Pistol Squats",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/23751201-Single-Leg-Squat-with-Support-(female)_Thighs_.mp4",
    howToSteps: [
      "Stand next to a squat rack or stable support and hold it with one hand for balance.",
      "Lift one foot off the floor and extend that leg slightly forward.",
      "Engage your core, pull your shoulders back, and brace your body.",
      "Lower yourself into a squat by bending the planted knee while keeping the raised leg off the floor.",
      "Descend as low as your mobility allows, then push through your heel to stand back up while exhaling.",
      "Complete all repetitions on one leg before switching to the other side.",
    ],
    isCustom: false,
  },

  {
    name: "Back Extension (Hyperextension)",
    primaryMuscle: "Lower Back",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/18601201-Hyperextension-(VERSION-2)_Hips.mp4",
    howToSteps: [
      "Set yourself up on the back extension machine with your hips and thighs resting against the pad and your ankles secured under the foot brace.",
      "Cross your arms over your chest, engage your core, and take a breath.",
      "Lower your torso by bending at the hips until you feel a stretch in your hamstrings and glutes.",
      "Engage your glutes and lower back to raise your torso back to the top position, pausing briefly and exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Back Extension (Machine)",
    primaryMuscle: "Lower Back",
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05731201-Lever-Back-Extension_Waist.mp4",
    howToSteps: [
      "Sit on the back extension machine with your hips and buttocks pressed firmly against the pad.",
      "Place your feet securely on the foot platform and position the upper pad against your upper back.",
      "Select an appropriate resistance and cross your arms over your chest.",
      "Engage your core, take a breath, and push the pad backward by contracting your lower back muscles while exhaling.",
      "Slowly return to the starting position by leaning forward under control while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Back Extension (Weighted Hyperextension)",
    primaryMuscle: "Lower Back",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/57821201-Weighted-Hyperextension-(female)_Hips_.mp4",
    howToSteps: [
      "Set yourself up on a back extension bench with your heels secured against the foot pads and your hips resting against the support pad.",
      "Bend forward at the hips and pick up a weight plate from the floor or have a training partner hand it to you.",
      "Extend your torso to the starting position while bracing your core.",
      "Lower your body by hinging at the hips with a neutral spine until you feel a stretch in your posterior chain.",
      "Engage your hamstrings, glutes, and lower back to extend your torso back to the top position, exhaling near the top.",
    ],
    isCustom: false,
  },

  {
    name: "Ball Slams",
    primaryMuscle: "Full Body",
    secondaryMuscles: ["shoulders", "abdominals", "glutes", "quadriceps"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/75351201-Medicine-Ball-Slam-(VERSION-2)-(male)_Waist_.mp4",
    howToSteps: [
      "Stand tall with your feet in a comfortable stance and your toes slightly pointed outward.",
      "Hold a medicine ball with both hands at stomach level.",
      "Engage your core, slightly bend your knees, and drive the medicine ball overhead with straight arms.",
      "Inhale, then forcefully slam the ball down just in front of your body while exhaling.",
      "Bend your knees to pick up the ball while keeping your spine neutral.",
      "Reset your stance and repeat the movement for the desired number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Band Pullaparts",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["upper back"],
    equipment: "Resistance Band",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/45681201-Resistance-Band-Pull-Apart_Shoulders_.mp4",
    howToSteps: [
      "Hold a resistance band with both hands using a shoulder-width grip, keeping light tension on the band.",
      "Extend your arms straight out in front of your body with palms facing each other.",
      "Take a breath, then pull the band apart by moving your arms out to the sides while keeping them straight, exhaling as you pull.",
      "Slowly return your arms to the starting position while inhaling and maintaining control.",
    ],
    isCustom: false,
  },

  {
    name: "Battle Ropes",
    primaryMuscle: "Cardio",
    secondaryMuscles: ["shoulders", "upper back", "forearms"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/01281201-Battling-Ropes.mp4",
    howToSteps: [
      "Grab the ends of the battle ropes with one handle in each hand.",
      "Bend your knees slightly and hinge forward at the hips while keeping your spine neutral.",
      "Brace your core and lift one arm to shoulder height while driving the opposite arm down toward your knees.",
      "Quickly reverse the arm positions, creating alternating waves in the ropes.",
      "Continue alternating your arms at a steady tempo while breathing regularly.",
      "Maintain the movement for the desired time or until fatigue sets in.",
    ],
    isCustom: false,
  },

  {
    name: "Behind the Back Bicep Wrist Curl (Barbell)",
    primaryMuscle: "Forearms",
    secondaryMuscles: ["biceps"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/63651201-EZ-Barbell-Standing-Back-Wrist-Curl_Forearms_.mp4",
    howToSteps: [
      "Place a loaded barbell or EZ bar on the floor and stand directly in front of it.",
      "Squat down with your arms at your sides and palms facing backward, then grip the bar evenly while keeping your back straight.",
      "Drive through your heels to stand up, lifting the bar behind your body.",
      "Brace your core, take a breath, and curl the bar upward by flexing your wrists while keeping your arms and elbows still, exhaling at the top.",
      "Slowly extend your wrists to lower the bar back down while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Behind the Back Curl (Cable)",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["forearms"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/48381201-Cable-Unilateral-Bicep-Curl_Upper-Arms_.mp4",
    howToSteps: [
      "Set the cable pulleys to mid-thigh height, attach handles, and select an appropriate load.",
      "Grab the handles and step forward so the pulleys are positioned behind your body.",
      "Allow the weight to pull your elbows slightly behind your torso while maintaining control.",
      "Stand tall with your chest up, lean slightly forward, and stagger your stance for balance.",
      "Engage your core and curl the handles forward until your wrists reach elbow level, squeezing your biceps while exhaling.",
      "Slowly extend your arms back to the starting position, allowing the handles to travel behind your body while inhaling.",
      "Repeat for the desired number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Belt Squat (Machine)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/29501201-Lever-Belt-Squat_Thighs_.mp4",
    howToSteps: [
      "Load the belt squat machine appropriately and put on the weight belt.",
      "Step onto the platform and attach the belt’s chain to the machine lever using a carabiner.",
      "Stand tall and hold the handles or horizontal bar in front of you for balance.",
      "Place your feet at a comfortable squat width with your toes slightly pointed outward.",
      "Lift your chest, engage your core, and unrack the weight.",
      "Inhale and lower yourself until your thighs are roughly parallel to the platform.",
      "Pause briefly at the bottom, then push through your heels to extend your knees while exhaling.",
      "Reset your stance, inhale, and repeat the movement for the desired number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Bench Dip",
    primaryMuscle: "Triceps",
    secondaryMuscles: ["shoulders", "chest"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/13991201-Bench-dip-on-floor_Upper-Arms.mp4",
    howToSteps: [
      "Position yourself facing away from a sturdy bench, box, or chair.",
      "Place your hands flat on the edge of the bench with your fingers pointing forward.",
      "Extend your legs in front of you and support your lower body on your heels while keeping your torso upright.",
      "Engage your core, take a breath, and lower your body by bending your elbows.",
      "Descend until your elbows reach approximately a 90-degree angle and pause briefly.",
      "Press through your palms to extend your arms and return to the top position while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Bench Press (Cable)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/01511201-Cable-Bench-Press_Chest.mp4",
    howToSteps: [
      "Place a flat bench in the center of a dual cable machine.",
      "Set both pulleys to a low position, select the desired load, and attach handles.",
      "Grab the handles and sit on the bench with your arms close to your body.",
      "Lie back carefully and position your arms at your sides without flaring your elbows.",
      "Pull your shoulders back, engage your core, and take a breath.",
      "Press both handles upward and inward, tapping your knuckles together at the top while exhaling.",
      "Lower the handles under control until your elbows reach torso level while inhaling.",
      "Finish the set by bringing the handles in, sitting up slowly, and safely releasing them.",
    ],
    isCustom: false,
  },

  {
    name: "Bench Press (Dumbbell)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02891201-Dumbbell-Bench-Press_Chest.mp4",
    howToSteps: [
      "Sit on a flat bench holding a pair of dumbbells and rest them on your thighs.",
      "Pull your shoulders back, engage your core, and take a breath.",
      "Kick the dumbbells up with your thighs as you lie back onto the bench.",
      "Position the dumbbells over your chest with arms extended, shoulder blades pressed into the bench, and feet flat on the floor.",
      "Inhale and lower the dumbbells under control to your sides while keeping your elbows slightly tucked.",
      "Lower the weights until your elbows reach torso level.",
      "Press the dumbbells back to the starting position, bringing them together at the top while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Bench Press (Smith Machine)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/07481201-Smith-Bench-Press_Chest.mp4",
    howToSteps: [
      "Place a flat gym bench in the middle of a Smith machine.",
      "Adjust the bar to a height where you can grab and unrack it from a lying position.",
      "Lie on the bench and position your lower chest directly underneath the bar.",
      "Grab the bar with an even overhand grip.",
      "Bring your shoulders back and dig the balls of your feet into the floor.",
      "Take a breath and unrack the bar.",
      "Lower the bar until it taps your chest and press it to the top as you exhale.",
    ],
    isCustom: false,
  },

  {
    name: "Bench Press - Close Grip (Barbell)",
    primaryMuscle: "Triceps",
    secondaryMuscles: ["shoulders"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00301201-Barbell-Close-Grip-Bench-Press_Upper-Arms.mp4",
    howToSteps: [
      "Set the barbell at a height where you can reach it from a lying position.",
      "Lie on the bench and position your head underneath the bar.",
      "Reach up and grab the bar with an even, overhand grip. Your hands should be shoulder-width apart.",
      "Bring your shoulder blades back and draw your feet back and toward the bench, digging the balls of your feet into the floor.",
      "Engage your body, unrack the bar, and bring it over your chest.",
      "Breathe in and lower the barbell to your lower chest.",
      "Press the bar to the top position and exhale.",
      "Once finished, bring the barbell over the rack and rest it gently.",
    ],
    isCustom: false,
  },

  {
    name: "Bench Press - Wide Grip (Barbell)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/01221201-Barbell-Wide-Bench-Press_Chest.mp4",
    howToSteps: [
      "Set the barbell at a height where you can grab it from a lying position.",
      "Lie on the bench and position yourself so that the bar is directly over your forehead.",
      "Reach up and grab the bar with an overhand grip. Start with your hands shoulder-width apart, and gradually increase your grip width.",
      "Retract your shoulder blades and dig them into the bench.",
      "Bring your feet back and in toward the bench, digging the balls of your feet into the floor.",
      "Engage your upper body, unrack the barbell, and bring it over your chest.",
      "Take a breath and lower the barbell to the bottom (lower chest, nipple line).",
      "Tap your torso and push the bar back to the top, squeezing your triceps, shoulders, and pectorals. Exhale near the top.",
      "Once finished, bring the bar back over the safety pins and rack it.",
    ],
    isCustom: false,
  },

  {
    name: "Bent Over Row (Band)",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["lats", "biceps", "forearms"],
    equipment: "Resistance Band",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/38991201-Band-bent-over-row-(male)_Back.mp4",
    howToSteps: [
      "Take an open-ended resistance band with handles on both sides.",
      "Step over the middle of the band with both feet.",
      "Grab both handles and lean forward while keeping your spine neutral. The band should offer some tension even with your arms fully extended. You can increase or decrease the tension by having your feet closer or wider apart.",
      "Bring your shoulders back and take a breath.",
      "Pull both ends of the band up and in until your elbows are at torso level. Exhale at the top.",
      "Extend your arms as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Bent Over Row (Barbell)",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["lats", "biceps", "forearms"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00271201-Barbell-Bent-Over-Row_Back.mp4",
    howToSteps: [
      "Stand in front of a loaded barbell with your feet in a comfortable stance and toes pointing slightly out.",
      "Lean forward by hinging at the hip and keep your spine in a neutral position.",
      "Grab the barbell with an even overhand grip.",
      "Engage your abs and lift the bar several inches off the floor.",
      "With your shoulders back and midsection tight, take a breath and row the barbell.",
      "Lift the bar until it taps your stomach and hold the position for a moment as you exhale.",
      "Lower the bar slowly.",
    ],
    isCustom: false,
  },

  {
    name: "Bent Over Row (Dumbbell)",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["lats", "biceps", "forearms"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02931201-Dumbbell-Bent-Over-Row_Back.mp4",
    howToSteps: [
      "Grab a pair of dumbbells and stand tall.",
      "Bring your shoulders back, engage your abs, and lean forward while keeping your back straight. Your torso should be as parallel to the floor as possible.",
      "Have your arms straight and hanging down with your wrists neutral (facing one another).",
      "Take a breath and row both dumbbells until your elbows are at torso level. Exhale at the top.",
      "Lower the weights, breathing in on the way down.",
    ],
    isCustom: false,
  },

  {
    name: "Bicep Curl (Barbell)",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["forearms"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00311201-Barbell-Curl_Upper-Arms.mp4",
    howToSteps: [
      "Pick the bar up and hold it with a grip slightly wider than your hips. Your arms should be straight, with your palms facing forward.",
      "Straighten your back, bring your chest out, take a breath, and curl the barbell, exhaling at the top. Do not use body swinging or momentum to lift the bar; rely only on your bicep strength.",
      "Lower the bar slowly as you breathe in, extending your arms and stretching your biceps.",
      "Repeat.",
    ],
    isCustom: false,
  },

  {
    name: "Bicep Curl (Cable)",
    primaryMuscle: "Biceps",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/01561201-Cable-Curl_Upper-Arms.mp4",
    howToSteps: [
      "Attach a straight bar to a low cable pulley.",
      "Set the load on the weight stack at the appropriate amount.",
      "Lean forward and grab the straight bar evenly with your palms facing up.",
      "Stand up and step back if necessary to lift the weight from its stack.",
      "Bring your shoulders back, engage your abs, and keep your elbows at your sides.",
      "Take a breath and curl the weight, keeping your elbows steady.",
      "Lift the weight until your wrists are slightly higher than your elbows and exhale.",
      "Lower the weight slowly, breathing in on the way down.",
    ],
    isCustom: false,
  },

  {
    name: "Bicep Curl (Dumbbell)",
    primaryMuscle: "Biceps",
    secondaryMuscles: [],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02941201-Dumbbell-Biceps-Curl_Upper-Arms.mp4",
    howToSteps: [
      "Grab a pair of dumbbells and stand tall with your feet in a comfortable stance and shoulders retracted.",
      "Have your wrists pointing forward and your arms extended.",
      "Take a breath and curl both dumbbells simultaneously. Lift the weights until your wrists are slightly higher than your elbows and exhale.",
      "Extend your arms slowly and breathe in on the way down.",
    ],
    isCustom: false,
  },

  {
    name: "Bicep Curl (Machine)",
    primaryMuscle: "Biceps",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/10321201-Lever-Alternate-Biceps-Curl_Upper-Arms_.mp4",
    howToSteps: [
      "Select the correct load on the machine and adjust your seat’s height.",
      "Sit down and grab the handles by your sides.",
      "Bring your shoulders back, engage your abs, and take a breath.",
      "Bend one arm to lift the handle. Curl until your hand is slightly higher than your elbow, and breathe out.",
      "Extend your arm slowly as you breathe in.",
      "Bend your opposite arm in the same way.",
      "Keep alternating until you finish the set.",
    ],
    isCustom: false,
  },

  {
    name: "Bicep Curl (Suspension)",
    primaryMuscle: "Biceps",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/10701201-Suspender-Arm-Curl-(female)_Upper-Arms_.mp4",
    howToSteps: [
      "Grab the pair of handles attached to a suspension training kit.",
      "Walk your feet forward to lean your body back to some degree.",
      "Extend your body, squeeze your glutes, and bring your shoulders back.",
      "Take a breath and bend your arms to lift your body.",
      "Bend your arms until your elbows are at slightly more than a 90-degree angle, and breathe out.",
      "Extend your arms slowly, lowering your body to the starting position as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Bicycle Crunch",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00031201-air-bike-m_waist.mp4",
    howToSteps: [
      "Lie on the floor, lift your legs off the floor, and bend your knees at a 90-degree angle.",
      "Place your fingertips behind your head or neck.",
      "Take a breath, engage your midsection, and crunch, bringing your right elbow to your left knee. Exhale.",
      "Extend your body as you breathe in.",
      "Crunch again, taking your left elbow to your right knee. Exhale again.",
      "Keep alternating until you complete the set.",
    ],
    isCustom: false,
  },

  {
    name: "Bicycle Crunch Raised Legs",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/01471201-Bycicle-Twisting-Crunch_Waist.mp4",
    howToSteps: [
      "Lie on the floor, lift your legs off the ground, and extend them in the air.",
      "Place your fingertips behind your head or neck.",
      "Take a breath, engage your midsection, and crunch your upper body.",
      "Twist your upper body, bringing your right elbow to your left leg while bending your left knee toward the opposite elbow.",
      "Hold for a moment as you breathe out.",
      "Extend your body and breathe in.",
      "Take your left elbow to your right knee.",
      "Keep alternating until you complete the set.",
    ],
    isCustom: false,
  },

  {
    name: "Bird Dog",
    primaryMuscle: "Glutes",
    secondaryMuscles: ["hamstrings", "shoulders"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/51821201-Bird-Dog-(VERSION-2)-(female)_Back_.mp4",
    howToSteps: [
      "Get down on all fours with your shoulders, elbows, and wrists aligned and your knees directly under your hips. Keep your hands flat on the floor.",
      "Engage your abs and take a breath.",
      "Extend your right leg back and up, aligning it with your torso. At the same time, extend your left arm forward. Exhale.",
      "Bring your arm and leg back to the starting position as you breathe in.",
      "Extend your opposite limbs.",
      "Keep alternating between opposite limbs until you complete the set.",
    ],
    isCustom: false,
  },

  {
    name: "Box Jump",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes", "calves"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/71591201-Jump-Box-(female)_Plyometrics_.mp4",
    howToSteps: [
      "Stand in front of a plyometric box or a flat gym bench.",
      "Have your feet close together and keep your spine neutral.",
      "Take a breath and descend into a quarter squat as you bring your arms back.",
      "Immediately jump by pushing through your heels and swinging your arms forward.",
      "Exhale as you land on the bench or box.",
      "Step off and breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Box Squat (Barbell)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/49621201-Barbell-Box-Squat_Hips_.mp4",
    howToSteps: [
      "Set the barbell at the appropriate height and position a plyometric box behind you.",
      "Unrack the bar as you would for standard squats and take a couple of steps back. The box should be a few inches away from your heels.",
      "Take a breath and descend into a squat.",
      "Move down until your buttocks touch the box.",
      "Hold the position for a moment and push through your heels to squat up. Exhale.",
    ],
    isCustom: false,
  },

  {
    name: "Boxing",
    primaryMuscle: "Cardio",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/22731101-Boxing-Right-Cross_small.jpg",
    howToSteps: [],
    isCustom: false,
  },

  {
    name: "Bulgarian Split Squat",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/22901201-Dumbbell-Bulgarian-Split-Squat-(female)_Thighs.mp4",
    howToSteps: [
      "Face away from a flat gym bench.",
      "Grab a pair of dumbbells and extend one leg back, placing the foot on the bench.",
      "Bring your shoulders back, engage your midsection, and take a breath.",
      "Squat by bending your front leg.",
      "Descend until your front thigh is almost parallel to the floor.",
      "Hold the bottom position for a moment and push through your heel to extend your leg as you exhale.",
      "Complete the desired number of reps, switch legs, and repeat for the other leg.",
    ],
    isCustom: false,
  },

  {
    name: "Burpee",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/11601201-Burpee_Cardio.mp4",
    howToSteps: [
      "Stand tall with your feet in a comfortable stance, arms at your sides, and gaze directed forward.",
      "Take a breath, lean forward, and bend your knees to place your hands flat on the floor just in front of your feet.",
      "Kick your legs back to extend your body into a push-up position with your shoulders, hips, knees, and ankles aligned.",
      "Inhale and perform a push-up, lowering until your face is an inch or two from the floor if desired. Exhale as you extend your arms.",
      "Kick your legs forward to bring your feet just behind your hands as you breathe in.",
      "Extend your body and perform a vertical jump while raising your arms overhead. Exhale.",
    ],
    isCustom: false,
  },

  {
    name: "Burpee Over the Bar",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/101811201-Burpee-Over-the-Bar-(male)_Plyometrics_.mp4",
    howToSteps: [
      "Place a barbell on the ground and stand perpendicular to it.",
      "Get down into a high plank position.",
      "With your body straight and shoulders, elbows, and wrists aligned, take a breath and perform a push-up. Exhale as you press back to the high plank position.",
      "Kick your feet forward and stand up.",
      "Jump laterally over the barbell as you breathe out.",
      "Get down into a high plank position again, breathe in, and perform another push-up.",
      "Stand up and jump laterally over the barbell again, repeating the sequence.",
      "Continue jumping over the bar until you finish the set.",
    ],
    isCustom: false,
  },

  {
    name: "Butterfly (Pec Deck)",
    primaryMuscle: "Chest",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/10301201-Lever-Pec-Deck-Fly_Chest.mp4",
    howToSteps: [
      "Select the load on the pec deck machine.",
      "Adjust the seat height so you can grab the handles and position the pads in front of your chest.",
      "Sit down, grab the handles, and bring your shoulders back.",
      "Engage your abs and take a breath.",
      "Flex your chest muscles to bring the handles from your sides to in front of your torso as you breathe out.",
      "Bring your arms back to your sides as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Cable Core Palloff Press",
    primaryMuscle: "Abdominals",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/12021201-Cable-horizontal-Pallof-Press_waist.mp4",
    howToSteps: [
      "Select the load on the cable machine.",
      "Place the pulley at chest height and attach a handle.",
      "Grab the handle with both hands and stand sideways to the machine.",
      "Bring your shoulders back, squeeze your glutes, and engage your midsection.",
      "Take a breath and press the handle forward, fully extending your arms as you exhale.",
      "Pause for a moment and bring the handle back toward your body as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Cable Crunch",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/01751201-Cable-Kneeling-Crunch_Waist.mp4",
    howToSteps: [
      "Grab a rope attachment with both hands and have your thumbs facing up.",
      "Kneel, lean forward, and position the rope behind your head, keeping your hands close to your neck.",
      "Engage your midsection once in position.",
      "Initiate the crunch by taking a breath and flexing your abs, focusing on curling your torso rather than hinging at the hips.",
      "Hold for a moment as you exhale.",
      "Slowly raise your torso back to the starting position as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Cable Fly Crossovers",
    primaryMuscle: "Chest",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/12691201-Cable-Standing-Up-Straight-Crossovers_Chest.mp4",
    howToSteps: [
      "Adjust the load on the pair of weight stacks inside the cable crossover machine.",
      "Set the pulleys to the highest position and attach handles to both.",
      "Grab the handles one at a time and position yourself centered between the two pillars.",
      "Bring your arms to your sides and take a half step forward to lift the weights from their stacks.",
      "Engage your abs, bring your shoulders back, and inhale.",
      "Bring your arms in and down, meeting your knuckles in front of your hips as you exhale.",
      "Hold for a moment and return your arms to your sides as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Cable Pull Through",
    primaryMuscle: "Glutes",
    secondaryMuscles: ["hamstrings", "lower back"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/12061201-Cable-pull-through_hips.mp4",
    howToSteps: [
      "Select the appropriate load on a single or double cable machine station.",
      "Set the pulley to the lowest position and attach a handle or rope.",
      "Face away from the cable machine, lean forward, grab the attachment, and hold it between your legs.",
      "Take one or two steps forward to lift the weight from its stack.",
      "Engage your abs and take a breath.",
      "Hinge at the hips, leaning your torso forward while keeping your back neutral.",
      "Lean forward until your torso is roughly parallel to the floor, then drive your hips forward to stand tall as you exhale.",
    ],
    isCustom: false,
  },

  {
    name: "Cable Twist (Down to Up)",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/12071201-Cable-twist-(down-up)_waist.mp4",
    howToSteps: [
      "Select the appropriate load on the cable machine.",
      "Place the pulley in the lowest position and attach a handle to it.",
      "Grab the handle with both hands, keeping your wrists neutral and facing one another.",
      "Take a step away from the cable machine and stand sideways with your feet wide enough to create a stable base.",
      "With the handle at your waist and arms straight, engage your abs and take a breath.",
      "Pull the cable diagonally and upward across your body, twisting your torso as you exhale.",
      "Hold for a second and rotate your torso back to the starting position as you breathe in.",
      "After completing one side, turn your body 180 degrees and repeat for the other side.",
    ],
    isCustom: false,
  },

  {
    name: "Cable Twist (Up to Down)",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/08621201-Cable-twist-(up-down)_Waist.mp4",
    howToSteps: [
      "Select the appropriate load on the cable machine.",
      "Place the pulley in the highest position and attach a handle to it.",
      "Grab the handle with both hands, keeping your wrists neutral and facing one another.",
      "Take a step away from the cable machine and stand sideways.",
      "With the handle at shoulder level and arms straight, engage your abs and breathe in.",
      "Pull the cable diagonally across your body, twisting your torso as you exhale.",
      "Rotate your body back to the starting position as you breathe in.",
      "After finishing one side, turn your body 180 degrees and repeat for the other side.",
    ],
    isCustom: false,
  },

  {
    name: "Calf Extension (Machine)",
    primaryMuscle: "Calves",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/23151201-Lever-Rotary-Calf_Calves.mp4",
    howToSteps: [
      "Select the appropriate load on the calf extension machine.",
      "Sit down and grab the handles by your sides.",
      "Place the balls of your feet on the footplate with your legs straight.",
      "Take a breath and flex your ankles to push the plate away as you exhale.",
      "Hold for a moment and allow your ankles to bend as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Calf Press (Machine)",
    primaryMuscle: "Calves",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/07381201-Sled-45-Calf-Press_Calves.mp4",
    howToSteps: [
      "Load a leg press machine and sit down.",
      "Raise your legs and place the balls of your feet at the edge of the footplate.",
      "Bring your shoulders back and grab the handles by your sides.",
      "Extend your knees to unrack the weight.",
      "Flex your ankles to press the platform away from yourself and hold for a moment as you breathe out.",
      "Allow your ankles to bend and stretch your calves as you breathe in.",
      "Once finished, turn the handles you are holding to secure the weight.",
    ],
    isCustom: false,
  },

  {
    name: "Chest Dip",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02511201-Chest-Dip_Chest.mp4",
    howToSteps: [
      "Grip a parallel bar slightly wider than shoulder-width.",
      "Bring your shoulders back and engage your abs.",
      "Raise yourself and support your body over the dip bars with your elbows fully extended.",
      "Tilt your body forward.",
      "Take a breath and dip by bending at the elbows while maintaining your body position.",
      "Lower yourself until you feel a strong stretch in your chest, typically when your elbows reach about a 90-degree angle.",
      "Push yourself back to the top position, exhaling at the top.",
    ],
    isCustom: false,
  },

  {
    name: "Chest Dip (Assisted)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00091201-Assisted-Chest-Dip-(kneeling)_Chest.mp4",
    howToSteps: [
      "Select the correct weight on the chest dip machine.",
      "Grab the pair of handles and place your knees on the pads.",
      "Extend your arms, bring your shoulders back, and engage your abs.",
      "Take a breath and lower yourself by bending your elbows.",
      "Descend until your elbows are at roughly a 90-degree angle, then push yourself back to the top as you exhale.",
    ],
    isCustom: false,
  },

  {
    name: "Chest Dip (Weighted)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/17551201-Weighted-Tricep-Dips_Upper-Arms_.mp4",
    howToSteps: [
      "Attach a weight plate to yourself using a dipping belt.",
      "Step onto the platform and grab the parallel bars with your arms straight and close to your body.",
      "Bring your shoulders back and down, engage your abs, and squeeze your glutes.",
      "Lift your feet off the platform to suspend your body in the air.",
      "Lean forward slightly.",
      "Take a breath and lower yourself by bending your elbows, keeping your shoulder blades retracted and your body steady.",
      "Descend until your elbows form roughly a 90-degree angle and hold for a moment.",
      "Press yourself back to the top, fully extending your arms as you exhale.",
      "Take another breath and repeat.",
    ],
    isCustom: false,
  },

  {
    name: "Chest Fly (Band)",
    primaryMuscle: "Chest",
    secondaryMuscles: [],
    equipment: "Resistance Band",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/09131201-Band-Middle-Fly-(female)_Chest_.mp4",
    howToSteps: [
      "Take an open-ended resistance band with handles on both ends.",
      "Anchor the band to a sturdy object such as a squat rack.",
      "Turn away from the anchor point and grab both handles, keeping them close to your body.",
      "Take a couple of steps forward to create tension and bring your arms to your sides without flaring your elbows.",
      "Bring your shoulders back, engage your abs, and take a breath.",
      "Move your arms forward and tap your knuckles together in front of your chest while keeping your elbows slightly bent. Exhale.",
      "Bring your arms back to your sides as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Chest Fly (Dumbbell)",
    primaryMuscle: "Chest",
    secondaryMuscles: [],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/03081201-Dumbbell-Fly_Chest.mp4",
    howToSteps: [
      "Grab a pair of light dumbbells and sit on the edge of a flat gym bench.",
      "Place the weights on your thighs and lie back, keeping the dumbbells close to your body.",
      "Extend your arms and position the dumbbells over your chest with your palms facing one another.",
      "Plant your feet on the floor and bring your shoulders back.",
      "Take a breath.",
      "Lower your arms out to your sides until they align with your torso.",
      "Bring your arms back in, tapping the dumbbells together over your chest as you exhale.",
    ],
    isCustom: false,
  },

  {
    name: "Chest Fly (Machine)",
    primaryMuscle: "Chest",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05961201-Lever-Seated-Fly_Chest.mp4",
    howToSteps: [
      "Select the appropriate load and adjust the seat height so the handles are at chest level when seated.",
      "Sit down, bring your shoulders back, and reach to the sides to grab the handles.",
      "Engage your abs and take a breath.",
      "Squeeze your chest and bring your arms in, tapping your knuckles lightly in front of your chest as you breathe out.",
      "Bring your arms back to your sides, feeling the stretch in your chest as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Chest Fly (Suspension)",
    primaryMuscle: "Chest",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/57371201-Suspension-Fly_Chest-FIX_.mp4",
    howToSteps: [
      "Face away from the anchor point of the suspension kit and grab both handles.",
      "Straighten your arms, raise them in front of your body, and engage your abs.",
      "Walk your feet back enough to lean your body forward, supporting yourself with your arms.",
      "Take a breath and slowly bring your arms out to your sides, lowering your body and stretching your chest.",
      "Extend your arms as far as your strength allows, hold briefly, and bring them back in as you raise your body.",
      "Tap your knuckles together at the top position and exhale.",
    ],
    isCustom: false,
  },

  {
    name: "Chest Press (Band)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Resistance Band",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/09201201-Band-Standing-Chest-Press-(female)_Chest_.mp4",
    howToSteps: [
      "Take an open-ended resistance band with handle attachments.",
      "Anchor the band to a sturdy object at chest height, such as a squat rack.",
      "Face away from the anchor point and grab both handles, raising your arms and keeping your elbows tucked.",
      "Take a couple of steps forward to stretch the band and create tension.",
      "Bring your shoulders back, stagger your stance, engage your midsection, and take a breath.",
      "Press the band forward and fully extend your arms as you exhale.",
      "Bend your arms and bring your knuckles back to the sides of your chest as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Chest Press (Machine)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05771201-Lever-Chest-Press_Chest.mp4",
    howToSteps: [
      "Select the appropriate load on the chest press machine.",
      "Adjust the seat height so the handles are slightly below your lower chest when seated.",
      "Sit down, grab the handles, bring your shoulders back, engage your abs, and keep your feet flat on the floor.",
      "Take a breath and press the handles forward until your arms are fully extended, exhaling at the top.",
      "Slowly bend your arms and return to the starting position as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Chest Supported Incline Row (Dumbbell)",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["lats", "biceps", "forearms"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/03271201-Dumbbell-Incline-Row_Back.mp4",
    howToSteps: [
      "Set an adjustable gym bench to an incline of 30 to 45 degrees.",
      "Grab a pair of dumbbells and position yourself on the bench with your chest and stomach supported by the backrest.",
      "Let your arms extend and hang straight down toward the floor.",
      "Bring your shoulders back, squeeze your glutes, and engage your abs.",
      "Rotate your wrists outward so your knuckles face forward.",
      "Take a breath and row the dumbbells upward in one smooth motion, exhaling at the top.",
      "Lower the weights slowly, breathing in on the way down.",
    ],
    isCustom: false,
  },

  {
    name: "Chest Supported Reverse Fly (Dumbbell)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["upper back"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/03831201-Dumbbell-Reverse-Fly_Shoulders.mp4",
    howToSteps: [
      "Grab a pair of light dumbbells and position yourself face down on an incline gym bench.",
      "Keep your body straight and support yourself on the balls of your feet.",
      "Let your arms hang straight down with your palms facing one another.",
      "Bring your shoulders back and take a breath.",
      "Lift the dumbbells out to your sides and slightly back, stopping when you feel tension in the rear of your shoulders. Exhale.",
      "Hold briefly and lower your arms slowly as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Chest Supported Y Raise (Dumbbell)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["upper back"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/35411201-Dumbbell-Incline-Y-Raise_Shoulders_.mp4",
    howToSteps: [
      "Set a gym bench to a 45-degree incline.",
      "Grab a pair of light dumbbells and sit down with your chest and stomach supported against the bench, letting your arms hang straight down.",
      "Take a deep breath and lift the dumbbells forward and upward in a Y-shaped motion, exhaling at the top.",
      "Lower the weights back to the starting position as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Chin Up",
    primaryMuscle: "Lats",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/13261201-Chin-Up_Back.mp4",
    howToSteps: [
      "Reach up and grab a pull-up bar with a double underhand grip, keeping your hands shoulder-width apart or slightly closer.",
      "Retract your shoulders, engage your abs, squeeze your glutes, and cross your lower legs to lift your feet off the floor.",
      "Take a breath and pull yourself up in one fluid motion until your chin clears the bar. Exhale at the top.",
      "Lower yourself slowly and with control as you breathe in, without resting your feet on the floor.",
    ],
    isCustom: false,
  },

  {
    name: "Chin Up (Assisted)",
    primaryMuscle: "Lats",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05721201-Lever-Assisted-Chin-Up_Back_.mp4",
    howToSteps: [
      "Select the appropriate load on the assisted chin-up machine.",
      "Reach up and grab the bar with a double underhand grip, keeping your hands shoulder-width apart.",
      "Place your knees on top of the machine pad.",
      "Bring your shoulders back, squeeze your glutes, and engage your abs.",
      "Take a breath and pull yourself up in one fluid motion, exhaling at the top.",
      "Lower yourself slowly with control, fully extending your arms as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Chin Up (Weighted)",
    primaryMuscle: "Lats",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/41811201-Weighted-Hang-Chin-Up_Back_.mp4",
    howToSteps: [
      "Attach a weight plate to yourself using a dipping belt.",
      "Reach up and grab a pull-up bar with a double underhand grip.",
      "Retract your shoulders, engage your abs, squeeze your glutes, and cross your lower legs to lift your feet off the floor.",
      "Take a breath and pull yourself up in one fluid motion as you exhale.",
      "Lower yourself slowly with control, fully extending your arms as you breathe in without resting your feet on the floor.",
    ],
    isCustom: false,
  },

  {
    name: "Clamshell (Band)",
    primaryMuscle: "Glutes",
    secondaryMuscles: [],
    equipment: "Resistance Band",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/98491201-Side-Plank-Clamshell-(male)_Hips_.mp4",
    howToSteps: [
      "Lie on one side with your legs stacked, knees bent, bottom shoulder at a 90-degree angle, and your forearm flat on the floor for balance. Optionally place a mini loop resistance band around your thighs.",
      "Maintain a neutral spine and breathe in.",
      "Raise your top knee while keeping your feet together, mimicking a clamshell opening.",
      "Lift your knee as high as possible in one smooth motion and exhale.",
      "Lower your knee back down as you breathe in.",
      "Once finished, switch to the other side and repeat for the same number of reps.",
    ],
    isCustom: false,
  },

  {
    name: "Clap Push Ups",
    primaryMuscle: "Chest",
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/12731201-Clap-Push-Up_Plyometrics_Chest.mp4",
    howToSteps: [
      "Get down on all fours and extend your body into a push-up position. Keep your body straight with shoulders, elbows, and wrists aligned.",
      "Pull your shoulders back and squeeze your glutes to engage your core.",
      "Take a breath and lower your body by bending your elbows.",
      "Lower yourself until your face is one to two inches from the floor and pause briefly.",
      "Push up as explosively as possible, lifting your hands off the floor while breathing out.",
      "Bring your hands together quickly and clap before placing them back on the floor.",
      "Breathe in as you lower yourself into the next repetition.",
    ],
    isCustom: false,
  },

  {
    name: "Clean",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/15211101-Barbell-Hang-Clean-Below-the-Knees_Weightlifts_small.jpg",
    howToSteps: [
      "Stand in front of a loaded barbell with your shins a few inches away. Keep your feet hip-width apart with toes slightly pointed out.",
      "Bend down and grip the barbell with an even overhand grip, positioning your knees near the crease of your elbows.",
      "Lift your chest to set a neutral spine. Your hips should be slightly higher than your knees.",
      "Initiate the first pull by deadlifting the barbell off the floor while pressing your heels into the ground to generate momentum.",
      "As the barbell passes your knees, continue driving your hips forward and pull the bar in a straight vertical line in one smooth motion.",
      "Drop into a squat and catch the barbell on your shoulders and upper chest with elbows pointing forward.",
      "Dip slightly until your thighs are parallel to the floor, then stand up fully, straightening your knees and exhaling.",
      "Lower the barbell under control by hinging at the hips while maintaining a neutral spine, breathing in before the next repetition.",
    ],
    isCustom: false,
  },

  {
    name: "Clean and Jerk",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00281201-Barbell-Clean-and-Press_Shoulders.mp4",
    howToSteps: [
      "Stand in front of a loaded barbell with your shins a few inches away. Keep your feet hip-width apart with toes slightly pointed out.",
      "Bend down and grip the barbell with an even overhand grip, positioning your knees near the crease of your elbows.",
      "Lift your chest to set a neutral spine, keeping your hips slightly higher than your knees.",
      "Initiate the first pull by deadlifting the barbell off the floor while driving through your heels to generate momentum.",
      "As the barbell passes your knees, continue driving your hips forward and pull the bar in a straight vertical line in one smooth motion.",
      "Drop into a squat and catch the barbell on your shoulders and upper chest with elbows pointing forward.",
      "Dip slightly until your thighs are parallel to the floor, then stand up fully, straightening your knees and breathing out.",
      "Take another breath, dip slightly, and jerk the barbell overhead by forcefully extending your elbows and knees.",
      "Lower the barbell back to your shoulders under control while breathing out.",
      "Bring the barbell down to the floor while maintaining a neutral spine, breathing in before the next repetition.",
    ],
    isCustom: false,
  },

  {
    name: "Clean and Press",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00281201-Barbell-Clean-and-Press_Shoulders.mp4",
    howToSteps: [
      "Stand in front of a loaded barbell with your shins a few inches away. Keep your feet hip-width apart with toes slightly pointed out.",
      "Lean forward and grip the barbell with an even overhand grip, positioning your knees near the crease of your elbows.",
      "Lift your chest to set a neutral spine, keeping your hips slightly higher than your knees.",
      "Initiate the first pull by deadlifting the barbell off the floor while pressing through your heels to generate momentum.",
      "As the barbell passes your knees, drive your hips forward and pull the bar in a straight vertical line in one smooth motion.",
      "Drop into a squat and catch the barbell on your shoulders and upper chest with elbows pointing forward.",
      "Dip slightly until your thighs are parallel to the floor, then stand up fully, straightening your knees and exhaling.",
      "Take another breath and press the barbell straight overhead, moving your head back slightly to avoid contact, and exhale.",
      "Lower the barbell back to your shoulders under control before returning it to the starting position.",
    ],
    isCustom: false,
  },

  {
    name: "Clean Pull",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/15171201-Barbell-Clean-Pull_Weightlifts_.mp4",
    howToSteps: [
      "Stand in front of a barbell with your feet hip-width apart and the bar positioned over your mid-foot.",
      "Lean forward and grip the barbell with an even overhand grip.",
      "Pull your shoulders back to straighten your spine, lower yourself to the bar, and take the slack out of the barbell.",
      "Take a breath and initiate the pull by driving your heels into the floor.",
      "Extend your hips and knees while maintaining a neutral back position.",
      "Continue extending your knees and hips as the barbell travels upward.",
      "Once the bar passes your knees, begin the second pull by forcefully pressing through your heels as if performing a vertical jump.",
      "Drive your hips forward and fully extend your knees and hips as the barbell accelerates upward.",
      "Immediately shrug your shoulders and pull upward until the bar reaches slightly above waist height, exhaling forcefully.",
      "Lower the barbell under control by pushing your glutes back while keeping your chest up and spine neutral, breathing in before the next repetition.",
    ],
    isCustom: false,
  },

  {
    name: "Concentration Curl",
    primaryMuscle: "Biceps",
    secondaryMuscles: [],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02971201-Dumbbell-Concentration-Curl_Upper-Arms.mp4",
    howToSteps: [
      "Sit on a flat bench holding a light dumbbell and spread your legs apart.",
      "Place the dumbbell between your legs and reach down to grip it with one hand.",
      "Lift the dumbbell off the floor and rest your upper arm against the inside of your thigh.",
      "Keep your chest up and body stable, take a breath, and fully extend your arm.",
      "Curl the dumbbell upward until your wrist is higher than your elbow while keeping your upper arm fixed against your leg.",
      "Squeeze your biceps at the top of the movement and breathe out.",
      "Lower the dumbbell slowly until your arm is fully extended while breathing in.",
      "Complete the desired repetitions, then switch arms and repeat.",
    ],
    isCustom: false,
  },

  {
    name: "Cross Body Hammer Curl",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["forearms"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/16571201-Dumbbell-Cross-Body-Hammer-Curl-(Version-2)_Upper-Arms-FIX.mp4",
    howToSteps: [
      "Stand tall holding a pair of dumbbells at your sides with palms facing your body.",
      "Position your feet in a comfortable stance and keep your arms relaxed by your sides.",
      "Pull your shoulders back, squeeze your glutes, and take a breath to brace your body.",
      "Curl one dumbbell across your body toward your opposite shoulder while breathing out.",
      "Lower the dumbbell back to the starting position as you breathe in.",
      "Repeat the movement with the opposite arm, alternating sides until the set is complete.",
    ],
    isCustom: false,
  },

  {
    name: "Crunch",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02741201-Crunch-Floor-m_waist.mp4",
    howToSteps: [
      "Lie flat on the floor with your knees bent and feet planted firmly on the ground.",
      "Place your fingertips lightly behind your head without pulling on your neck.",
      "Engage your abdominal muscles and take a breath.",
      "Crunch upward by lifting your shoulder blades a few inches off the floor while exhaling at the top.",
      "Lower your upper body back to the floor in a controlled manner while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Crunch (Machine)",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05951201-Lever-Seated-Crunch-(chest-pad).mp4",
    howToSteps: [
      "Select an appropriate weight on the machine.",
      "Sit on the machine and secure your ankles under the bottom pads, place the middle pad against your lower back, and position your chest against the top pad.",
      "Grip the handles firmly for stability.",
      "Take a breath and contract your abdominal muscles to push the top pad forward while exhaling.",
      "Slowly return to the starting position as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Crunch (Weighted)",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/66031201-Weighted-Plate-Lying-Crunch-(male)_Waist_.mp4",
    howToSteps: [
      "Lie flat on the floor while holding a weight plate.",
      "Position the weight plate securely over your chest.",
      "Bring your legs together, bend your knees, and place your feet flat on the floor.",
      "Take a breath and contract your abdominal muscles to lift your shoulder blades a few inches off the floor while breathing out.",
      "Lower your upper body back to the floor under control as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Curtsy Lunge (Dumbbell)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/08811201-Dumbbell-Curtsey-lunge-(female)_Thighs_.mp4",
    howToSteps: [
      "Stand tall holding a dumbbell in each hand by your sides.",
      "Engage your core, pull your shoulders back, and take a breath.",
      "Step one leg back in a semicircle, crossing it behind your front leg.",
      "Plant the ball of your back foot on the floor and lower into a lunge.",
      "Descend until your back knee is just above the floor.",
      "Push through the heel of your front foot to stand back up and return the rear leg to the starting position while exhaling.",
      "Inhale and repeat the movement with the opposite leg.",
      "Alternate sides until all repetitions are complete.",
    ],
    isCustom: false,
  },

  {
    name: "Dead Bug",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/78391201-Dead-Bug-(VERSION-3)-(female)_Waist_.mp4",
    howToSteps: [
      "Lie on an exercise mat with your back flat on the ground.",
      "Lift your feet off the floor and bend your knees to a 90-degree angle.",
      "Extend your arms straight up over your chest.",
      "Engage your abdominal muscles to maintain a neutral spine and take a breath.",
      "Slowly extend one leg, lowering the foot to a few inches above the floor.",
      "At the same time, extend the opposite arm overhead toward the floor while breathing out.",
      "Return your arm and leg to the starting position as you breathe in.",
      "Repeat the movement with the opposite arm and leg, alternating sides.",
    ],
    isCustom: false,
  },

  {
    name: "Dead Hang",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["lats", "forearms"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/50551101-Dead-Hang-Stretch_Stretching_small.jpg",
    howToSteps: [
      "Stand underneath a pull-up bar.",
      "Reach up and grab the bar using an even overhand grip.",
      "Lift your feet off the floor and keep your legs together.",
      "Relax your shoulders and core while supporting your body using grip strength.",
      "Hang for as long as possible while breathing steadily throughout the hold.",
    ],
    isCustom: false,
  },

  {
    name: "Deadlift (Band)",
    primaryMuscle: "Glutes",
    secondaryMuscles: [
      "hamstrings",
      "quadriceps",
      "lower back",
      "upper back",
      "lats",
    ],
    equipment: "Resistance Band",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/08951201-Band-Deadlift-(female)_Hips_.mp4",
    howToSteps: [
      "Hold an open-ended resistance band with handles in both hands.",
      "Step over the band so it runs under your feet, keeping them a few inches apart.",
      "Stand tall, pull your shoulders back, engage your core, and take a breath.",
      "Hinge at the hips to lean forward while keeping your chest up.",
      "Bend your knees slightly as you descend to maintain a neutral spine.",
      "Lower your torso until your hands are several inches off the floor or as far as mobility allows.",
      "Pause briefly, then drive your hips forward to stand back up.",
      "Exhale near the top of the movement.",
    ],
    isCustom: false,
  },

  {
    name: "Deadlift (Barbell)",
    primaryMuscle: "Glutes",
    secondaryMuscles: [
      "hamstrings",
      "quadriceps",
      "lower back",
      "upper back",
      "lats",
    ],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00321201-Barbell-Deadlift_Hips-FIX.mp4",
    howToSteps: [
      "Stand in front of a loaded barbell.",
      "Position the bar over your mid-foot with your shins one to two inches away, feet hip-width apart, and toes slightly pointed out.",
      "Hinge forward and grip the bar with a double overhand grip.",
      "Bend your knees to bring your shins to the bar while pulling your shoulders back to set a neutral spine.",
      "Take a breath and brace your core.",
      "Initiate the pull by driving your heels into the floor.",
      "Lift the barbell in a straight vertical line, keeping it close to your body.",
      "As the bar passes your knees, extend your legs and drive your hips forward to stand tall.",
      "Begin the descent by pushing your hips back while maintaining a neutral spine.",
      "Lower the barbell along the same vertical path, exhaling near the bottom.",
    ],
    isCustom: false,
  },

  {
    name: "Deadlift (Dumbbell)",
    primaryMuscle: "Glutes",
    secondaryMuscles: [
      "hamstrings",
      "quadriceps",
      "lower back",
      "upper back",
      "lats",
    ],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/03001201-Dumbbell-Deadlift_Hips.mp4",
    howToSteps: [
      "Stand with your feet hip-width apart and place a pair of dumbbells parallel to your feet, aligned with your mid-foot.",
      "Hinge forward and grasp the dumbbells with straight arms.",
      "Lift your chest to set a neutral spine without lifting the dumbbells.",
      "Take a breath and initiate the lift by pressing through your heels while engaging your legs and upper body.",
      "Lift the dumbbells in a straight vertical line, guiding them up along your sides.",
      "Extend your hips and knees together, standing fully upright and breathing out at the top.",
      "Begin the descent by hinging at the hips and pushing your glutes back, lowering the dumbbells along the same straight path.",
      "Breathe in as the weights descend or before starting the next repetition.",
    ],
    isCustom: false,
  },

  {
    name: "Deadlift (Smith Machine)",
    primaryMuscle: "Glutes",
    secondaryMuscles: [
      "hamstrings",
      "quadriceps",
      "lower back",
      "upper back",
      "lats",
    ],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/07521201-Smith-Deadlift_Hips.mp4",
    howToSteps: [
      "Set the Smith machine bar to the lowest position and load an appropriate weight.",
      "Stand in front of the bar with your shins one to two inches away.",
      "Hinge forward and grip the bar with a double overhand grip.",
      "Bend your knees slightly and lift your chest to establish a neutral spine.",
      "Take a breath and pull the bar upward, extending your hips as you approach the top while breathing out.",
      "Pause briefly at the top, then lower the bar by pushing your hips back while keeping your back neutral.",
      "Breathe in as the bar descends or before starting the next repetition.",
    ],
    isCustom: false,
  },

  {
    name: "Deadlift (Trap Bar)",
    primaryMuscle: "Glutes",
    secondaryMuscles: [
      "hamstrings",
      "quadriceps",
      "lower back",
      "upper back",
      "lats",
    ],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/08111201-Trap-Bar-Deadlift_Thighs.mp4",
    howToSteps: [
      "Load a trap bar and stand inside it with your feet hip-width apart and toes slightly pointed out.",
      "Squat down and grip the handles on both sides of the bar.",
      "Pull your shoulders back to set a neutral spine.",
      "Take a breath and initiate the pull by driving your heels into the floor.",
      "As the bar rises, extend your hips and knees together until you are standing upright, breathing out near the top.",
      "Lower the trap bar under control by pushing your hips back first and then bending your knees.",
      "Breathe in as the bar descends or before starting the next repetition.",
    ],
    isCustom: false,
  },

  {
    name: "Deadlift High Pull",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/11991201-Sumo-Deadlift-High-Pull_Thighs_Shoulders.mp4",
    howToSteps: [
      "Stand in front of a loaded barbell.",
      "Set your feet in a wide stance with toes pointed outward and shins one to two inches from the bar.",
      "Hinge forward and grip the bar with a double overhand grip, hands placed several inches apart.",
      "Bend your knees, lift your chest, and straighten your back to set a neutral spine.",
      "Initiate the pull by driving your heels into the floor and engaging your legs.",
      "Extend your hips and knees together until you reach an upright position.",
      "Immediately pull the barbell upward in a straight vertical line as you fully extend your body.",
      "Lift the bar until it reaches chest height while breathing out.",
      "Begin lowering the bar by hinging at the hips as it passes your upper thighs.",
      "Lower the barbell along the same straight vertical path.",
      "Breathe in as the bar descends or before initiating the next repetition.",
    ],
    isCustom: false,
  },

  {
    name: "Decline Bench Press (Barbell)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00331201-Barbell-Decline-Bench-Press_Chest.mp4",
    howToSteps: [
      "Lie down on the decline bench with your head secured and position your eyes or forehead directly under the bar.",
      "Grip the barbell with a double overhand grip, placing your hands slightly wider than shoulder-width apart.",
      "Pull your shoulders back, engage your core, and take a breath to brace your body.",
      "Unrack the barbell carefully and hold it directly over your chest.",
      "Take another breath and lower the barbell under control to your lower chest.",
      "Lightly touch your chest and press the barbell straight upward, exhaling near the top of the movement.",
      "Once the set is complete, guide the barbell back over the rack and secure it before relaxing your body.",
    ],
    isCustom: false,
  },

  {
    name: "Decline Bench Press (Dumbbell)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/03011201-Dumbbell-Decline-Bench-Press_Chest.mp4",
    howToSteps: [
      "Set yourself on a decline bench and secure your feet firmly.",
      "Lie back and retract your shoulder blades to stabilize your upper body.",
      "Have a partner hand you the dumbbells one at a time, or carefully lie back while holding them.",
      "Start with your arms extended, core engaged, and dumbbells positioned over your chest.",
      "Take a breath to brace your body.",
      "Lower the dumbbells down toward your sides while keeping your elbows slightly tucked.",
      "Continue lowering until your elbows reach torso level.",
      "Press the dumbbells straight back up to the starting position while exhaling.",
      "When finished, have a partner take at least one dumbbell so you can safely sit up.",
    ],
    isCustom: false,
  },

  {
    name: "Decline Bench Press (Machine)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/13001201-Lever-Decline-Chest-Press_Chest-FIX_.mp4",
    howToSteps: [
      "Load the machine with an appropriate weight.",
      "Adjust the seat height so the handles sit just below chest level when seated.",
      "Sit down and grip the handles, keeping your elbows tucked close to your sides.",
      "Retract your shoulder blades, plant your feet firmly on the floor, engage your core, and inhale.",
      "Press the handles forward and downward, fully extending your elbows while exhaling and squeezing your chest briefly at the top.",
      "Slowly bend your arms to return to the starting position while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Decline Bench Press (Smith Machine)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/07531201-Smith-Decline-Bench-Press_Chest.mp4",
    howToSteps: [
      "Place a decline bench under the Smith machine so the bar lines up with your lower chest when you lie back.",
      "Load the bar with an appropriate weight and set it at a height you can safely reach while lying down.",
      "Lie back on the bench, grip the bar with a double overhand grip, and retract your shoulders.",
      "Unrack the bar by extending your arms.",
      "Take a breath and lower the bar under control to your chest.",
      "Press the bar upward to the top position while exhaling.",
      "Once the set is complete, carefully rack the bar and stand up.",
    ],
    isCustom: false,
  },

  {
    name: "Decline Chest Fly (Dumbbell)",
    primaryMuscle: "Chest",
    secondaryMuscles: [],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/03021201-Dumbbell-Decline-Fly_Chest.mp4",
    howToSteps: [
      "Adjust the bench to a decline position.",
      "Sit on the bench holding a pair of light dumbbells and secure your feet.",
      "Keep the dumbbells close to your chest and carefully lie back on the bench.",
      "Extend your arms and position the dumbbells over your chest with palms facing each other, retracting your shoulder blades.",
      "Take a breath and lower your arms out to your sides, stretching your chest while keeping a slight bend in your elbows.",
      "Bring your arms back together over your chest, squeezing your chest muscles and lightly tapping the dumbbells at the top while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Decline Crunch",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02771201-Decline-Crunch_Waist.mp4",
    howToSteps: [
      "Position yourself on a decline bench and secure your feet firmly.",
      "Lie back carefully, keeping your spine in contact with the bench.",
      "Place your hands lightly behind your head without pulling on your neck.",
      "Take a breath and crunch your torso by contracting your abdominal muscles, lifting your shoulder blades several inches off the bench while exhaling.",
      "Lower your torso back down under control as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Decline Crunch (Weighted)",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/21301201-Weighted-decline-crunch_Waist.mp4",
    howToSteps: [
      "Hold a weight plate and position yourself on a decline bench, securing your legs in place.",
      "Lie back carefully while keeping the weight plate pressed against your chest.",
      "Take a breath and engage your abdominal muscles.",
      "Crunch your torso upward by lifting your shoulder blades several inches off the bench while exhaling.",
      "Pause briefly at the top, then lower your torso slowly under control as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Decline Push Up",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02791201-Decline-Push-Up_Chest.mp4",
    howToSteps: [
      "Get down on all fours and place your feet on a bench, plyo box, or another stable elevated surface.",
      "Extend your body into a push-up position with your hands wider than shoulder-width apart and slightly rotated outward.",
      "Straighten your arms and retract your shoulder blades to stabilize your upper body.",
      "Engage your core and take a breath.",
      "Lower your body by bending your elbows under control.",
      "Descend until your face is close to the floor.",
      "Press yourself back up by extending your arms and exhale near the top.",
    ],
    isCustom: false,
  },

  {
    name: "Diamond Push Up",
    primaryMuscle: "Triceps",
    secondaryMuscles: ["shoulders"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02831201-Diamond-Push-up_Upper-Arms.mp4",
    howToSteps: [
      "Get down on all fours and place your hands close together so your thumbs and index fingers touch or are a few inches apart.",
      "Extend your body into a push-up position, aligning your shoulders, hips, and knees.",
      "Pull your shoulders back, squeeze your glutes, and take a breath to brace your body.",
      "Lower yourself by bending your elbows while keeping them close to your sides.",
      "Descend as low as possible and pause briefly at the bottom.",
      "Press yourself back up by straightening your arms and exhale near the top.",
    ],
    isCustom: false,
  },

  {
    name: "Downward Dog",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/52511201-Downward-Facing-Dog-(female)_Stretching_.mp4",
    howToSteps: [
      "Start on all fours with your knees under your hips and your shoulders, elbows, and wrists stacked vertically.",
      "Take a breath and push your hips back while extending your arms.",
      "Lift your glutes upward and straighten your legs to form an inverted V shape while keeping your upper body rigid.",
      "Hold the position while breathing steadily, then release by bending your knees and bringing your torso forward.",
    ],
    isCustom: false,
  },

  {
    name: "Drag Curl",
    primaryMuscle: "Biceps",
    secondaryMuscles: [],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00381201-Barbell-Drag-Curl_Upper-Arms.mp4",
    howToSteps: [
      "Stand tall holding a loaded straight bar with an underhand grip, palms facing forward.",
      "Position your hands just outside your thighs.",
      "Pull your shoulders back and take a breath to brace your body.",
      "Curl the bar upward by bending your elbows while keeping the bar in contact with your torso.",
      "Lift the bar as high as possible, squeezing your biceps at the top and exhaling.",
      "Lower the bar back down along the same path while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Dragon Flag",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/40581201-Leg-Raise-Dragon-Flag_Waist_.mp4",
    howToSteps: [
      "Lie on a flat bench and firmly grip the back support with both hands.",
      "Extend your body fully and engage your core muscles.",
      "Take a breath and lift your entire body off the bench using your abdominal strength.",
      "Raise your body as high as possible while keeping it straight and exhale at the top.",
      "Lower your body slowly under control while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Dumbbell Row",
    primaryMuscle: "Lats",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02921201-Dumbbell-Bent-over-Row_Back.mp4",
    howToSteps: [
      "Hold a dumbbell in one hand and place the opposite knee and hand on a flat bench for support.",
      "Keep your free leg planted on the floor and your working arm hanging straight down with the dumbbell.",
      "Pull your shoulders back, engage your core, and maintain a neutral spine.",
      "Row the dumbbell upward until your elbow reaches torso level, squeezing your back muscles and exhaling.",
      "Lower the dumbbell under control while keeping your shoulders set and breathing in.",
      "Switch sides by placing the opposite hand and knee on the bench and repeat the movement.",
    ],
    isCustom: false,
  },

  {
    name: "Dumbbell Snatch",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/38881201-Dumbbell-One-Arm-Snatch_Weightlifting_.mp4",
    howToSteps: [
      "Place a dumbbell on the floor between your feet.",
      "Hinge forward and grip the dumbbell with one hand.",
      "Pull your shoulders back, engage your core, and take a breath.",
      "Drive through your legs and hips to thrust the dumbbell upward in one powerful motion.",
      "Dip slightly by bending your knees to receive the weight overhead.",
      "Fully extend your arm and straighten your legs while exhaling.",
      "Lower the dumbbell back down under control while breathing in.",
      "Complete the desired repetitions.",
      "Switch hands and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Dumbbell Squeeze Press",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/36811201-Dumbbell-Squeeze-Bench-Press_Chest-FIX_.mp4",
    howToSteps: [
      "Sit on a flat bench holding a pair of dumbbells and rest them on your thighs.",
      "Carefully lie back while keeping your elbows bent and the dumbbells close to your body.",
      "Extend your arms so the dumbbells are positioned over your chest with palms facing each other, squeezing the weights together.",
      "Pull your shoulders back, engage your chest, and inhale to brace.",
      "Lower the dumbbells toward your chest while maintaining pressure between them.",
      "Pause briefly at the bottom, then press the dumbbells back up to the starting position while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Dumbbell Step Up",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/58261201-Dumbbell-Step-up-(VERSION-2)-(male)_Thighs_.mp4",
    howToSteps: [
      "Hold a pair of dumbbells and stand in front of a flat bench or plyometric box.",
      "Pull your shoulders back, engage your core, and take a breath.",
      "Step one foot forward and plant it firmly on the elevated surface.",
      "Press through your front foot to step up onto the bench or box while exhaling.",
      "Step back down to the starting position under control while breathing in.",
      "Step forward with the opposite leg.",
      "Continue alternating legs until the set is complete.",
    ],
    isCustom: false,
  },

  {
    name: "Elbow to Knee",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/23121201-Lying-Elbow-to-Knee_Waist.mp4",
    howToSteps: [
      "Lie on the floor and bend your knees. Place the outside of one ankle across the opposite thigh.",
      "Place the opposite hand lightly behind your head.",
      "Take a breath and engage your abdominal muscles.",
      "Crunch and rotate your torso, bringing your elbow toward the opposite knee while exhaling.",
      "Lower your torso back to the floor under control while breathing in.",
      "Switch sides by placing the other ankle across your thigh and the opposite hand behind your head.",
      "Repeat for the same number of repetitions on both sides.",
    ],
    isCustom: false,
  },

  {
    name: "Elliptical Trainer",
    primaryMuscle: "Cardio",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/21921201-Elliptical-Machine-Walk_Cardio.mp4",
    howToSteps: [
      "Select an appropriate resistance level and step onto the elliptical machine.",
      "Pull your shoulders back, engage your core, and take a breath.",
      "Begin the movement by driving one leg forward while pulling the opposite handle back.",
      "Continue moving your arms and legs in an alternating pattern while maintaining a steady, controlled tempo.",
    ],
    isCustom: false,
  },

  {
    name: "EZ Bar Biceps Curl",
    primaryMuscle: "Biceps",
    secondaryMuscles: [],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/04471201-EZ-Barbell-Curl_Upper-Arms.mp4",
    howToSteps: [
      "Load an EZ bar and grip it with an even underhand grip, palms facing forward.",
      "Stand tall with your feet in a comfortable stance, knees slightly bent, and shoulders retracted.",
      "Take a breath and begin lifting the bar by contracting your biceps.",
      "Curl the bar upward until your wrists are slightly higher than your elbows while breathing out.",
      "Pause briefly at the top, then lower the bar under control as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Face Pull",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["biceps"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/77441201-Cable-Standing-Supinated-Face-Pull-(with-rope)_Sho.mp4",
    howToSteps: [
      "Select a light weight, set the pulley to a high position, and attach a rope handle.",
      "Grab the rope with your thumbs pointing toward the ceiling.",
      "Step back to lift the weight off the stack and adopt a staggered stance for stability.",
      "Pull your shoulders back, engage your core, and take a breath.",
      "Pull the rope toward your face by bending your elbows and externally rotating your shoulders.",
      "Squeeze your upper back and rear shoulders briefly at the end of the movement while exhaling.",
      "Slowly extend your arms to return to the starting position while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Farmers Walk",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/21331201-Farmers-walk_Cardio.mp4",
    howToSteps: [
      "Hold a pair of heavy dumbbells, kettlebells, or weight plates at your sides.",
      "Stand tall with your shoulders pulled back, core engaged, and eyes looking a few feet ahead.",
      "Begin walking forward slowly and under control while maintaining good posture.",
      "Breathe steadily as you continue walking for distance or time.",
      "When finished, bend your knees and carefully place the weights back on the floor.",
    ],
    isCustom: false,
  },

  {
    name: "Feet Up Bench Press (Barbell)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/62701201-Barbell-Larsen-Press-(male)_Chest_.mp4",
    howToSteps: [
      "Set the barbell at a height that allows you to unrack it without fully locking out your arms.",
      "Load the appropriate weight and lie back on the bench with your forehead directly under the bar.",
      "Grip the bar evenly with your hands slightly wider than shoulder-width apart.",
      "Retract your shoulder blades into the bench and extend your legs so your thighs, knees, or calves rest on the bench edge.",
      "Engage your core, unrack the barbell, and position it over your mid-chest.",
      "Take a breath and lower the barbell under control to your chest.",
      "Pause briefly, then press the barbell back to the top while exhaling.",
      "Breathe in and repeat for the prescribed number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Fire Hydrants",
    primaryMuscle: "Glutes",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/14751201-Bent-Leg-Side-Kick-(kneeling)-(female)_Hips-FIX_.mp4",
    howToSteps: [
      "Start on your hands and knees with your knees under your hips and your shoulders, elbows, and wrists aligned.",
      "Place your hands flat on the floor, engage your core, and maintain a neutral spine.",
      "Bend one leg at the knee without extending it.",
      "Take a breath and lift the bent leg out to the side as high as your mobility allows while keeping your hips square, exhaling at the top.",
      "Lower the leg back to the starting position under control while breathing in.",
      "Repeat for the desired number of repetitions, then switch legs and perform the same number on the opposite side.",
    ],
    isCustom: false,
  },

  {
    name: "Floor Press (Barbell)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/37241201-Barbell-Floor-Chest-Press_Chest_.mp4",
    howToSteps: [
      "Set the barbell on a squat rack at roughly one foot above the floor.",
      "Adjust the safety bars so they are at torso level when you are lying on the floor.",
      "Lie flat on the floor with the bar positioned above your forehead.",
      "Reach up and grip the bar with an even overhand grip.",
      "Retract your shoulder blades, engage your core, and take a breath.",
      "Unrack the barbell by extending your elbows fully.",
      "Move the barbell into position over your chest and take another breath.",
      "Lower the barbell until your elbows lightly touch the floor.",
      "Press the barbell back up to the starting position while exhaling near the top.",
    ],
    isCustom: false,
  },

  {
    name: "Floor Press (Dumbbell)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/36681201-Dumbbell-Lying-on-Floor-Chest-Press_Chest.mp4",
    howToSteps: [
      "Sit on the floor holding a pair of dumbbells.",
      "Bend your arms to bring the dumbbells close to your torso and carefully lie back.",
      "Keep your knees bent and your feet flat on the floor.",
      "Position the dumbbells at your sides, retract your shoulder blades, and engage your core.",
      "Take a breath and press the dumbbells upward and inward while exhaling at the top.",
      "Lower the dumbbells back to your sides under control while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Floor Triceps Dip",
    primaryMuscle: "Triceps",
    secondaryMuscles: ["shoulders"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/08151201-Triceps-Dips-Floor_Upper-Arms.mp4",
    howToSteps: [
      "Sit on the floor with your knees bent and feet flat on the ground.",
      "Lean your torso back and place your hands flat on the floor behind your body with fingers pointing forward.",
      "Engage your core and take a breath.",
      "Press through your palms to extend your arms and lift your hips several inches off the floor while exhaling.",
      "Slowly bend your elbows to lower your hips back to the floor while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Flutter Kicks",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/12441201-Flutter-Kicks-(version-3)_Hips.mp4",
    howToSteps: [
      "Lie flat on the floor with your arms by your sides and hands pressed into the ground.",
      "Engage your core and lift your feet a few inches off the floor.",
      "Begin alternating your legs up and down in small, controlled movements while breathing in.",
      "Maintain a steady tempo and controlled breathing throughout the exercise.",
    ],
    isCustom: false,
  },

  {
    name: "Frog Jumps",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["glutes", "hamstrings", "calves"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/101651201-Frog-Jump_Plyometrics_.mp4",
    howToSteps: [
      "Stand tall with your feet wider than hip-width apart and toes slightly pointed out.",
      "Engage your core and extend your arms in front of your hips.",
      "Take a breath and descend into a squat while keeping your heels planted on the floor.",
      "Lower until your hands lightly touch or brush the floor.",
      "Immediately drive through your heels and jump upward explosively while exhaling, keeping your arms pointed downward.",
      "Inhale as you land softly, descend into the next squat, and repeat the movement.",
    ],
    isCustom: false,
  },

  {
    name: "Frog Pumps (Dumbbell)",
    primaryMuscle: "Glutes",
    secondaryMuscles: ["hamstrings"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/61601201-Dumbbell-Frog-Hip-Thrust-(male)_Hips_.mp4",
    howToSteps: [
      "Lie flat on the floor holding a dumbbell.",
      "Carefully place the dumbbell over your hips or groin area and hold it securely with both hands.",
      "Bring the soles of your feet together and allow your knees to fall outward.",
      "Engage your core and take a breath.",
      "Press through your feet to lift your hips toward the ceiling, squeezing your glutes at the top while exhaling.",
      "Lower your hips back to the floor slowly under control while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Front Lever Hold",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/72511201-Hanging-Front-Lever-Raise-(male)_Waist_.mp4",
    howToSteps: [
      "Grab a pull-up bar with an even overhand grip, hands shoulder-width apart, and elbows fully extended.",
      "Bring your feet together and straighten your legs by engaging your quadriceps.",
      "Brace your core to maintain a neutral spine and avoid arching your lower back.",
      "Engage your entire upper body and take a breath.",
      "With your body rigid, lean back and initiate the front lever by engaging your lats and core.",
      "Raise your entire body into a horizontal position using your back, shoulders, and core muscles.",
      "Hold the horizontal position while breathing steadily.",
      "Slowly lower your body back to the starting position under control.",
    ],
    isCustom: false,
  },

  {
    name: "Front Raise (Band)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: [],
    equipment: "Resistance Band",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/09781201-Band-front-raise_Shoulders_.mp4",
    howToSteps: [
      "Hold an open-ended resistance band with handles in both hands.",
      "Step over the center of the band and position your arms by your sides while gripping the handles.",
      "Pull your shoulders back, engage your core, and take a breath.",
      "Raise your arms straight in front of your body in one smooth motion while exhaling at the top.",
      "Lower your arms back to your sides under control while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Front Raise (Barbell)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: [],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00411101-Barbell-Front-Raise_Shoulders.mp4",
    howToSteps: [
      "Grip the barbell with a double overhand grip, hands shoulder-width apart and palms facing back.",
      "Stand tall, pull your shoulders back, and engage your core.",
      "Take a breath and lift the barbell straight in front of your body with extended elbows until it reaches shoulder height, exhaling at the top.",
      "Lower the barbell back to the starting position under control while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Front Raise (Cable)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/01621201-Cable-Front-Raise_Shoulders.mp4",
    howToSteps: [
      "Set the pulley to the lowest position and attach a straight bar.",
      "Face away from the cable machine with the bar positioned between your legs.",
      "Grip the bar with an overhand grip, palms facing back, and keep your arms straight.",
      "Pull your shoulders back, engage your core, and slightly bend your knees.",
      "Take a breath and raise the bar away from your body in one smooth motion.",
      "Lift until the bar reaches shoulder height while exhaling, keeping your arms straight.",
      "Lower the bar back to the starting position under control while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Front Raise (Dumbbell)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: [],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/03101201-Dumbbell-Front-Raise_Shoulders.mp4",
    howToSteps: [
      "Stand tall holding a pair of dumbbells.",
      "Position the dumbbells in front of your thighs with palms facing back.",
      "Pull your shoulders back and take a breath.",
      "Raise both dumbbells straight in front of you until they reach shoulder height, exhaling at the top.",
      "Lower the dumbbells back to your upper thighs under control while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Front Raise (Suspension)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: [],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/10751201-Suspender-Front-Raise-(female)_Shoulders_.mp4",
    howToSteps: [
      "Grab the handles of a suspension trainer with your arms straight and positioned in front of your chest.",
      "Lean your body back slightly with your feet together and engage your core.",
      "Take a breath and raise your arms overhead, pulling your body into a more upright position while exhaling.",
      "Slowly lower your arms back in front of your chest as you lean back and breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Front Squat",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00421201-Barbell-Front-Squat_Hips.mp4",
    howToSteps: [
      "Set the barbell in a rack at collarbone height.",
      "Dip slightly by bending your knees, press your upper chest against the bar, and extend your arms forward.",
      "Bend one elbow and bring your forearm over the bar with your hand resting near your collarbone.",
      "Bring the other elbow up and place your hand over the bar so it rests securely on your shoulders.",
      "Lift your chest, take a breath, and extend your knees to unrack the barbell.",
      "Step back carefully to clear space for the squat.",
      "Inhale and descend by bending your knees while keeping your torso upright.",
      "Lower until your thighs are parallel to the floor or as low as mobility allows.",
      "Drive through your heels to stand back up and exhale near the top.",
    ],
    isCustom: false,
  },

  {
    name: "Full Squat",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00431201-Barbell-Full-Squat_Thighs.mp4",
    howToSteps: [
      "Position a barbell behind your neck, resting it securely on your upper back muscles.",
      "Grip the bar evenly with both hands for support.",
      "Pull your shoulders back and place your feet in a comfortable stance with toes slightly pointed out.",
      "Engage your core and take a breath.",
      "Squat down by bending your knees and hips while keeping your heels flat on the floor.",
      "Descend as deep as your mobility allows, pause briefly, then drive through your heels to stand back up.",
      "Exhale near the top of the movement.",
    ],
    isCustom: false,
  },

  {
    name: "Glute Bridge",
    primaryMuscle: "Glutes",
    secondaryMuscles: ["hamstrings", "quadriceps"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/101801201-Hamstring-Bridge-(VERSION-2)-(female)_Hips_.mp4",
    howToSteps: [
      "Lie flat on the floor.",
      "Bend your knees and place your feet flat on the ground.",
      "Rest your arms by your sides for balance.",
      "Take a breath and press through your heels to lift your hips toward the ceiling.",
      "Squeeze your glutes at the top, hold briefly, and exhale.",
      "Lower your hips back to the floor under control while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Glute Ham Raise",
    primaryMuscle: "Hamstrings",
    secondaryMuscles: ["glutes"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/57771201-Glute-Ham-Raise-(VERSION-2)-(female)_Thighs_.mp4",
    howToSteps: [
      "Set up on a glute ham raise machine with the ankle pad against your Achilles heels and your knees supported on the pad. Press the balls of your feet into the foot platform if available.",
      "Start with your torso upright, knees bent, and ankles secured. Cross your arms in front of your chest, retract your shoulder blades, and inhale.",
      "Slowly extend your knees and lower your torso forward while keeping your back and hips rigid.",
      "Descend as far as possible, ideally until your knees are nearly fully extended.",
      "Engage your hamstrings and glutes to bend your knees and raise your torso back to the starting position, exhaling near the top.",
    ],
    isCustom: false,
  },

  {
    name: "Glute Kickback (Machine)",
    primaryMuscle: "Glutes",
    secondaryMuscles: ["hamstrings"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/10371201-Lever-Standing-Rear-Kick_Hips.mp4",
    howToSteps: [
      "Select the appropriate load.",
      "Position your right side to the machine and grab the horizontal support bar.",
      "Place the back of your right thigh against the pad, just above the crease of the knee.",
      "Bring your shoulders back, engage your abs, and extend your leg back in one fluid motion as you exhale.",
      "Slowly bring your leg to the starting position as you breathe in.",
      "Once finished, rotate your body 180 degrees and repeat for your left leg.",
    ],
    isCustom: false,
  },

  {
    name: "Glute Kickback on Floor",
    primaryMuscle: "Glutes",
    secondaryMuscles: ["hamstrings"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/14741201-Bent-Leg-Kickback-(kneeling)_Hips.mp4",
    howToSteps: [
      "Get down on all fours with your hands flat and knees supporting your lower body.",
      "Position your knees under your hips and align your wrists, elbows, and shoulders.",
      "Engage your abs and take a breath.",
      "Kick your right leg back and up with your knee bent, squeezing your glutes at the top as you exhale.",
      "Slowly bring the leg back to the starting position as you breathe in.",
      "After completing one side, repeat the same number of reps with the other leg.",
    ],
    isCustom: false,
  },

  {
    name: "Goblet Squat",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/22811201-Dumbbell-Goblet-Squat-(female)_Thighs.mp4",
    howToSteps: [
      "Hold a dumbbell vertically in front of your torso using both hands.",
      "Place your palms firmly against the top weight plate on each side.",
      "Straighten your back, engage your abs, and inhale.",
      "Lower into a squat while keeping your torso upright.",
      "Descend as low as comfortable, ideally until your thighs are parallel to the floor.",
      "Push through your heels to return to the starting position and exhale near the top.",
    ],
    isCustom: false,
  },

  {
    name: "Good Morning (Barbell)",
    primaryMuscle: "Hamstrings",
    secondaryMuscles: ["glutes", "lower back", "upper back", "lats"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00441201-Barbell-Good-Morning_Thighs.mp4",
    howToSteps: [
      "Set the bar at armpit height and grip it evenly, slightly wider than shoulder width.",
      "Step under the bar and position it on your lower traps, around the rear deltoids.",
      "Extend your upper back and press the bar firmly into it, keeping your wrists straight and not supporting the bar with your hands.",
      "With feet hip-width apart, push your hips forward to unrack the bar and step back to clear space.",
      "Take a breath and push your hips straight back while keeping the bar tight against your upper back.",
      "Maintain a neutral spine and focus on pushing your glutes back as your torso leans forward.",
      "Lower your torso as far as possible while keeping your back straight, allowing a slight bend in your knees.",
      "Drive your hips forward to return to standing and exhale at the top.",
    ],
    isCustom: false,
  },

  {
    name: "Gorilla Row (Kettlebell)",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["lats", "biceps", "forearms"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/72301201-Kettlebell-Gorilla-Row-(male)_Back_.mp4",
    howToSteps: [
      "Place two kettlebells of equal weight on the floor and stand in front of them.",
      "Hinge forward at the hips and grab both kettlebell handles.",
      "Bend your knees slightly, retract your shoulder blades, and keep your back straight.",
      "Take a deep breath, engage your abs, and row one kettlebell until your elbow reaches torso level while exhaling.",
      "Lower the kettlebell back to the floor as you breathe in.",
      "Immediately row the opposite kettlebell and exhale.",
      "Continue alternating left and right sides until the set is complete.",
    ],
    isCustom: false,
  },

  {
    name: "Hack Squat",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00461201-Barbell-Hack-Squat_Hips.mp4",
    howToSteps: [
      "Place a barbell on the floor and stand in front of it with your calves nearly touching the bar.",
      "Lift your chest and descend into a squat position.",
      "Grab the barbell with your palms facing backward and keep your shoulders retracted.",
      "Take a deep breath and push through your heels to stand up while holding the bar firmly.",
      "Drag the barbell along your legs and glutes as you rise, exhaling near the top.",
      "Lower the bar by bending at the knees and hips while keeping your shoulders back and gaze forward.",
    ],
    isCustom: false,
  },

  {
    name: "Hack Squat (Machine)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/07431201-Sled-Hack-Squat_Hips.mp4",
    howToSteps: [
      "Add the desired weight to the machine.",
      "Step into the machine and position your shoulders firmly against the pads.",
      "Place your feet on the platform in a comfortable squat stance.",
      "Bring your shoulders back and engage your abs.",
      "Extend your knees to unrack the weight and release the safety latch.",
      "Inhale and lower your body by bending your knees.",
      "Descend until your knees reach approximately a 90-degree angle.",
      "Press through your heels to straighten your legs and exhale near the top.",
      "Re-engage the safety latch, rack the weight, and relax your body.",
    ],
    isCustom: false,
  },

  {
    name: "Hammer Curl (Resistance Band)",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["forearms"],
    equipment: "Resistance Band",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/46191201-Band-Standing-Hammer-Curl_Upper-Arms.mp4",
    howToSteps: [
      "Step on the middle of a looped or open-ended resistance band and grab both ends.",
      "Stand tall with your arms fully extended and your wrists neutral, facing your body.",
      "Take a breath and begin bending your arms under control.",
      "Curl the band until your wrists are slightly higher than your elbows, keeping your elbows close to your sides as you exhale.",
      "Slowly extend your arms back to the starting position while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Hammer Curl (Cable)",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["forearms"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/01661201-Cable-Hammer-Curl_Forearm.mp4",
    howToSteps: [
      "Select the appropriate weight and set the pulley to the lowest position.",
      "Attach a rope handle to the pulley.",
      "Lean forward slightly and grab both ends of the rope with a neutral grip, palms facing each other.",
      "Stand up and step back to lift the weight off the stack, engage your abs, and retract your shoulder blades.",
      "Take a breath and curl the rope upward by bending your arms, keeping your elbows close to your sides.",
      "Lift until your wrists are slightly higher than your elbows and exhale.",
      "Slowly extend your arms back to the starting position while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Hammer Curl (Dumbbell)",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["forearms"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/03121201-Dumbbell-Hammer-Curl-(version-2)_Upper-Arms.mp4",
    howToSteps: [
      "Hold a pair of dumbbells and stand upright.",
      "Keep your arms at your sides with a neutral grip, palms facing your body.",
      "Bring your shoulders back and take a breath.",
      "Curl both dumbbells at the same time until your wrists are slightly higher than your elbows, exhaling as you lift.",
      "Lower the dumbbells under control until your arms are fully extended while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Handstand Hold",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/33021201-Handstand_Upper-arms_.mp4",
    howToSteps: [
      "Stand upright with your arms extended overhead and your core engaged.",
      "Take a breath and hinge forward, placing your hands firmly on the floor.",
      "Kick or float your legs upward using controlled momentum until they extend toward the ceiling.",
      "Hold the handstand position while maintaining balance and core tension.",
    ],
    isCustom: false,
  },

  {
    name: "Handstand Push Up",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["triceps"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/04711201-Handstand-Push-Up_Shoulders_.mp4",
    howToSteps: [
      "Kick up into a handstand position with your hands flat on the floor. Use a wall for balance if needed.",
      "Once stable, take a breath and begin lowering by bending your elbows.",
      "Descend under control until your head is a few inches from the floor.",
      "Press through your hands, extend your elbows, and exhale to return to the top.",
    ],
    isCustom: false,
  },

  {
    name: "Hang Clean",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/15201201-Barbell-Hang-Clean_Weightlifts-FIX_.mp4",
    howToSteps: [
      "Stand tall holding a barbell with an overhand grip, hands slightly wider than shoulder width.",
      "Bring your shoulders back, engage your abs, and set your feet in a comfortable stance.",
      "Take a breath and explosively drive the bar upward by extending your hips.",
      "Quickly drop into a squat and catch the bar in a front rack position with the bar resting on your shoulders and elbows bent.",
      "Push through your heels to stand up tall and exhale at the top.",
      "Lower the barbell back to the starting position under control while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Hang Snatch",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/15231201-Barbell-Hang-Snatch-Below-the-Knees_Weightlifts_.mp4",
    howToSteps: [
      "Grip a loaded barbell with an overhand grip and stand tall with your arms straight.",
      "Engage your abs and take a breath.",
      "Hinge at the hips until the bar is just above knee level.",
      "Explosively drive your hips forward and pull the bar overhead while bending your knees and dropping into a squat.",
      "Catch the bar overhead with your elbows locked out and arms fully extended.",
      "Press through your heels to stand up tall, keeping your arms straight, and exhale at the top.",
    ],
    isCustom: false,
  },

  {
    name: "Hanging Knee Raise",
    primaryMuscle: "Abdominals",
    secondaryMuscles: ["forearms"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/98191201-Hanging-Knee-Raise-(male)_Waist_.mp4",
    howToSteps: [
      "Grab a pull-up bar with an overhand grip, hands about shoulder-width apart.",
      "Bring your legs together, engage your abs, and retract your shoulders.",
      "Take a breath and lift your legs by bending your knees.",
      "Raise your knees as high as possible in a smooth motion while exhaling.",
      "Lower your legs under control as you breathe in, keeping your lower back from arching.",
    ],
    isCustom: false,
  },

  {
    name: "Hanging Leg Raise",
    primaryMuscle: "Abdominals",
    secondaryMuscles: ["forearms"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/17641201-Hanging-Leg-Hip-Raise_Waist.mp4",
    howToSteps: [
      "Grab a pull-up bar with an even overhand grip, palms facing forward.",
      "Engage your abs, take a breath, and lift your feet off the floor to hang freely.",
      "Raise your legs toward your torso while keeping your body stable.",
      "Lift your legs as high as possible in one smooth motion and exhale.",
      "Lower your legs slowly under control while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Heel Taps",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00061201-Alternate-Heel-Touchers_waist.mp4",
    howToSteps: [
      "Lie on the floor with your knees bent, feet together, and planted flat on the ground.",
      "Place your arms by your sides and take a breath.",
      "Crunch your torso to the left and tap your left heel with your hand.",
      "Return to the center, take another breath, then crunch to the right and tap your right heel.",
      "Continue alternating left and right until the set is complete.",
    ],
    isCustom: false,
  },

  {
    name: "Hex Press (Dumbbell)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/36811201-Dumbbell-Squeeze-Bench-Press_Chest-FIX_.mp4",
    howToSteps: [
      "Grab a pair of dumbbells, ideally hex-shaped, and sit on a flat bench with the weights resting on your thighs.",
      "Lie back on the bench while keeping the dumbbells close to your torso.",
      "As you lie down, extend your arms and press the dumbbells together firmly.",
      "Retract your shoulder blades, engage your abs, and take a deep breath.",
      "Lower the dumbbells together toward your upper stomach and pause briefly.",
      "Press the weights upward by extending your arms while squeezing the dumbbells together and exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "High Knee Skips",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/30911201-High-Knee-Skips-(male)_Cardio-FIX_.mp4",
    howToSteps: [
      "Stand upright with your arms by your sides, legs straight, and feet a few inches apart.",
      "Bring your shoulders back, engage your abs, and inhale.",
      "Lift your left knee toward your chest while driving your left arm back and bending your right arm near your face.",
      "Lower your left foot to the floor as you exhale and return your right arm to your side.",
      "Immediately lift the opposite knee toward your chest while bending your left arm.",
      "Continue alternating sides with a steady, rhythmic tempo.",
    ],
    isCustom: false,
  },

  {
    name: "High Knees",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/30911201-High-Knee-Skips-(male)_Cardio-FIX_.mp4",
    howToSteps: [
      "Stand tall with your shoulders back, abs engaged, and eyes facing forward.",
      "Take a breath and lift your right knee toward your chest while driving your right arm back.",
      "Lower your right foot and immediately lift your left knee, driving your left arm back.",
      "Continue alternating knees at a steady tempo, raising each knee toward your chest.",
    ],
    isCustom: false,
  },

  {
    name: "Hip Abduction (Machine)",
    primaryMuscle: "Glutes",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05971201-Lever-Seated-Hip-Abduction_Hips.mp4",
    howToSteps: [
      "Select the appropriate weight and sit down on the machine.",
      "Bring your shoulders back and grab the handles at your sides for support.",
      "Place your feet on the platforms and position the outer part of your lower thighs against the pads.",
      "Take a breath and push your legs outward as far as possible in one controlled motion while exhaling.",
      "Slowly bring your knees back together as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Hip Adduction (Machine)",
    primaryMuscle: "Glutes",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05981201-Lever-Seated-Hip-Adduction_Thighs.mp4",
    howToSteps: [
      "Select the appropriate weight on the machine.",
      "Sit down and place your inner thighs against the pads with your feet on the foot platforms.",
      "Grab the side handles, retract your shoulder blades, and take a breath.",
      "Squeeze your inner thighs to bring the pads together while exhaling.",
      "Slowly return your legs to the starting position as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Hip Thrust",
    primaryMuscle: "Glutes",
    secondaryMuscles: ["hamstrings", "quadriceps"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/80151201-Glute-Bridge-from-Bench-(male)_Hips_.mp4",
    howToSteps: [
      "Sit on the floor and position your upper back against the edge of a bench.",
      "Bend your arms and place your hands across your chest.",
      "Bend your knees and plant your feet flat on the floor with your knees pointing forward.",
      "Bring your shoulders back and take a breath.",
      "Drive through your heels and squeeze your glutes to raise your hips until they align with your shoulders.",
      "Hold the contraction briefly at the top and exhale.",
      "Lower your hips back toward the floor under control while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Hip Thrust (Barbell)",
    primaryMuscle: "Glutes",
    secondaryMuscles: ["hamstrings", "quadriceps"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/10601201-Barbell-Hip-Thrust_Hips-FIX_.mp4",
    howToSteps: [
      "Sit on the floor and position a loaded barbell over your hips.",
      "Place your upper back against the edge of a flat bench.",
      "Bend your knees and plant your feet flat on the floor.",
      "Hold the barbell firmly with both hands to keep it stable.",
      "Engage your abs and take a breath.",
      "Drive through your heels and squeeze your glutes to thrust the barbell upward, exhaling at the top.",
      "Lower your hips back toward the floor under control while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Hip Thrust (Machine)",
    primaryMuscle: "Glutes",
    secondaryMuscles: ["hamstrings", "quadriceps"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/21461201-Lever-Hip-Thrust_Hips.mp4",
    howToSteps: [
      "Select the appropriate weight on the machine.",
      "Lie back with your upper back firmly against the pad and your arms by your sides.",
      "Secure the strap or belt comfortably over your hips.",
      "Engage your abs and take a deep breath.",
      "Press through your heels to extend your hips upward, squeezing your glutes at the top and exhaling.",
      "Lower your hips back to the starting position under control while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Hip Thrust (Smith Machine)",
    primaryMuscle: "Glutes",
    secondaryMuscles: ["hamstrings", "quadriceps"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/57611201-Smith-Hip-Thrust-(female)_Hips_.mp4",
    howToSteps: [
      "Set the Smith machine bar to a low position that allows you to sit underneath it.",
      "Load the bar appropriately and place a pad on it to reduce hip discomfort.",
      "Position a flat bench near the bar so your shoulder blades can rest on it once seated.",
      "Sit on the floor and lean back, placing your upper back against the bench with the bar positioned over your hips.",
      "Bend your knees and plant your feet firmly on the floor.",
      "Grab the bar, brace your core, and engage your abs.",
      "Press through your heels to drive your hips upward until they align with your knees and torso, exhaling at the top.",
      "Lower your hips back toward the floor under control while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Hollow Rock",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/56491201-Hollow-Rock-(male)_Waist_.mp4",
    howToSteps: [
      "Lie on an exercise mat with your legs straight, feet together, and arms by your sides.",
      "Brace your abs as if starting a crunch, pressing your lower back firmly into the mat.",
      "Squeeze your thighs together and lift your legs a few inches off the floor while keeping them straight.",
      "Lift your head slightly off the floor and extend your arms overhead behind you.",
      "Hold the hollow position while breathing steadily for the duration of the set.",
    ],
    isCustom: false,
  },

  {
    name: "Incline Bench Press (Barbell)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00471201-Barbell-Incline-Bench-Press_Chest.mp4",
    howToSteps: [
      "Lie back on an incline bench and grip the barbell with an even overhand grip, positioned so it can be unracked comfortably.",
      "Retract your shoulders, engage your abs, and plant your feet firmly on the floor.",
      "Take a breath and unrack the bar by fully extending your elbows.",
      "Bring the barbell over your upper chest and take another breath.",
      "Lower the bar under control to your mid chest and pause briefly.",
      "Press the bar upward in a straight line and exhale near the top.",
      "Carefully guide the bar back to the rack once the set is complete.",
    ],
    isCustom: false,
  },

  {
    name: "Incline Bench Press (Dumbbell)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/03141201-Dumbbell-Incline-Bench-Press_Chest.mp4",
    howToSteps: [
      "Set an incline bench to about 45 degrees, grab a pair of dumbbells, and sit down.",
      "Rest the dumbbells on your thighs, then lie back while kicking the weights up over your torso.",
      "Bring the dumbbells to your sides, plant your feet on the floor, retract your shoulders, and take a breath while keeping your elbows slightly tucked.",
      "Press both dumbbells upward until your arms are extended, lightly tapping the weights together at the top as you exhale.",
      "Lower the dumbbells back to your sides under control while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Incline Bench Press (Smith Machine)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/07571201-Smith-Incline-Bench-Press_Chest.mp4",
    howToSteps: [
      "Place an incline bench under the Smith machine so the bar aligns with your mid chest when lying down.",
      "Set the bar to a height that allows you to unrack without fully locking out your arms.",
      "Lie back, grip the bar with an overhand grip, and dig your shoulder blades into the bench.",
      "Engage your abs, press the bar upward, and rotate it to disengage the safety.",
      "Take a breath and lower the bar under control to your chest.",
      "Press the bar back to the top and exhale.",
      "Rotate the bar to re-engage the safety and rack it once the set is complete.",
    ],
    isCustom: false,
  },

  {
    name: "Incline Chest Fly (Dumbbell)",
    primaryMuscle: "Chest",
    secondaryMuscles: [],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/03191201-Dumbbell-Incline-Fly_Chest.mp4",
    howToSteps: [
      "Grab a pair of dumbbells and sit at the base of an incline bench.",
      "Rest the dumbbells on your thighs and slowly lie back onto the bench.",
      "Press the dumbbells up over your chest with your arms extended.",
      "Retract your shoulders and take a breath.",
      "Lower the dumbbells out to your sides until your elbows reach torso level, keeping a slight bend in your elbows.",
      "Bring the dumbbells back together over your chest by squeezing your pecs and exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Incline Chest Press (Machine)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/14791201-Lever-Incline-Chest-Press_Chest.mp4",
    howToSteps: [
      "Add the appropriate amount of weight to the machine.",
      "Adjust the seat height so you can comfortably grip the handles with your elbows slightly tucked.",
      "Sit down, plant your feet firmly on the floor, and grab the handles.",
      "Retract your shoulder blades, engage your abs, and take a breath.",
      "Press the handles upward in a smooth motion and exhale at the top.",
      "Slowly bend your arms to return to the starting position while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Incline Push Ups",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/37851201-Incline-Push-Up-(on-box).mp4",
    howToSteps: [
      "Place your hands on the edge of a sturdy elevated surface such as a bench, box, or chair.",
      "Extend your body into a straight line, setting up like a standard push-up.",
      "Retract your shoulders and squeeze your glutes to stabilize your body.",
      "Take a breath and lower your chest toward the object, lightly touching it at the bottom.",
      "Press yourself back up by extending your arms and exhale at the top.",
    ],
    isCustom: false,
  },

  {
    name: "Inverted Row",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["lats", "biceps", "forearms"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/04991201-Inverted-Row_Back.mp4",
    howToSteps: [
      "Set a bar at approximately hip height using a Smith machine or fixed bar.",
      "Grab the bar with an overhand grip and position yourself underneath it.",
      "Extend your arms so the bar is over your chest and balance your body on your heels.",
      "Engage your glutes and abs, bring your chest up, and keep your body in a straight line.",
      "Pull through your elbows to bring your chest toward the bar, touching it without flaring your elbows as you exhale.",
      "Lower yourself back to the starting position under control while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Iso-Lateral Chest Press (Machine)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05761201-Lever-Chest-Press-(plate-loaded)_Chest.mp4",
    howToSteps: [
      "Add the appropriate amount of weight to the machine.",
      "Adjust the seat height so you can press comfortably without flaring your elbows.",
      "Sit down and grab the handles with an overhand grip, palms facing down.",
      "Retract your shoulders, plant your feet firmly on the floor, and take a breath.",
      "Press the handles forward and upward, extending your arms and exhaling.",
      "Slowly bend your elbows to return to the starting position while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Iso-Lateral High Row (Machine)",
    primaryMuscle: "Lats",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/43781201-Lever-Reverse-Grip-High-Row-(plate-loaded)_Back_.mp4",
    howToSteps: [
      "Load the machine with the appropriate weight and adjust the thigh pad so your legs fit securely.",
      "Sit down on the machine and grab the handles.",
      "Bring your shoulders back, engage your abs, and take a breath.",
      "Pull the handles toward your torso while squeezing your back muscles and exhaling.",
      "Slowly extend your arms back to the starting position as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Iso-Lateral Low Row (Machine)",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["lats", "biceps", "forearms"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/42141201-Lever-Low-Row-(plate-loaded)_Back_.mp4",
    howToSteps: [
      "Add the appropriate amount of weight to the machine.",
      "Sit down with your chest and stomach firmly against the pad.",
      "Reach forward and grab both handles.",
      "Retract your shoulder blades, engage your abs, and take a deep breath.",
      "Pull the handles back until your elbows are close to your sides, squeezing your back muscles as you exhale.",
      "Slowly extend your arms back to the starting position while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Jack Knife (Suspension)",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/10821201-Suspender-Jack-knife-(female)_Waist_.mp4",
    howToSteps: [
      "Secure your feet in the handles of a suspension trainer.",
      "Extend your body into a push-up position with arms straight, shoulders back, and abs engaged.",
      "Take a breath and draw your knees toward your elbows while exhaling.",
      "Slowly extend your legs back to the starting position while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Jackknife Sit Up",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/38841201-Jack-knife-Sit-up-(female)_Waist_.mp4",
    howToSteps: [
      "Lie flat on the floor with your legs straight and arms by your sides, keeping your entire body in contact with the ground.",
      "Engage your abs and lift your legs while bending your knees.",
      "At the same time, raise your torso and bring your arms toward your lower body as you exhale.",
      "Lower your torso and extend your legs back to the starting position while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "JM Press (Barbell)",
    primaryMuscle: "Triceps",
    secondaryMuscles: ["chest", "shoulders"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00521201-Barbell-JM-Bench-Press_Upper-Arms-FIX_.mp4",
    howToSteps: [
      "Set the barbell at a height that allows you to unrack it without fully extending your arms.",
      "Lie on the bench, grab the bar with a shoulder-width grip, and unrack it.",
      "Position the bar over your chest with your arms straight, similar to a standard bench press setup.",
      "Plant your feet on the floor, retract your shoulder blades, engage your abs, and take a deep breath.",
      "Lower the bar by bending your elbows, bringing it toward your upper chest under control.",
      "Pause briefly, then extend your arms to press the bar back up while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Jump Rope",
    primaryMuscle: "Cardio",
    secondaryMuscles: [],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05111101-Jump-Rope_Cardio_small.jpg",
    howToSteps: [],
    isCustom: false,
  },

  {
    name: "Jump Shrug",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/49641201-Jump-Shrug_Thighs_.mp4",
    howToSteps: [
      "Hold a barbell with an overhand grip and stand tall with your hands just outside your thighs.",
      "Bring your shoulders back and engage your abs.",
      "Hinge slightly at the hips, leaning your torso forward just a bit.",
      "Take a breath, bend your knees slightly, and drive through your heels to jump.",
      "At the top of the movement, shrug your shoulders as high as possible and exhale.",
    ],
    isCustom: false,
  },

  {
    name: "Jump Squat",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes", "calves"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05141201-Jump-Squat_Thighs.mp4",
    howToSteps: [
      "Stand tall with your feet shoulder-width apart and toes pointing slightly out.",
      "Bring your shoulders back, engage your abs, and position your hands in front of your torso.",
      "Take a breath and descend halfway into a squat.",
      "Press through your heels and immediately jump as high as possible while swinging your arms back as you exhale.",
      "Land softly, take another breath, and descend into the next squat.",
    ],
    isCustom: false,
  },

  {
    name: "Jumping Jack",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/30941201-Jumping-Jack-(male)_Cardio.mp4",
    howToSteps: [
      "Stand tall with your arms at your sides, legs straight, and feet together.",
      "Engage your abs and take a breath.",
      "Hop and spread your feet while raising your arms out to the sides and overhead.",
      "Jump again to bring your feet together and arms back to your sides as you exhale.",
      "Continue rhythmically, hopping lightly off the floor and breathing regularly.",
    ],
    isCustom: false,
  },

  {
    name: "Jumping Lunge",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes", "calves"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/11661201-Jump-Split-m_Plyometrics.mp4",
    howToSteps: [
      "Stand tall with your feet a few inches apart, arms at your sides, and shoulders back.",
      "Engage your abs and take a breath.",
      "Jump vertically and bring your right leg forward and your left leg back.",
      "Land on your front foot and the ball of your back foot, immediately sinking into a lunge.",
      "Lower until your front thigh is nearly parallel to the floor.",
      "Press through your front heel to rise and immediately jump, exhaling as you move up.",
      "Switch leg positions in the air, inhale, and sink into the next lunge.",
      "Continue jumping and alternating legs with a lunge between each jump.",
    ],
    isCustom: false,
  },

  {
    name: "Kettlebell Around the World",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["upper back", "abdominals"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/45341201-Kettlebell-Standing-Slingshots-(female)_Shoulders_.mp4",
    howToSteps: [
      "Hold a kettlebell in your right hand and stand tall with your feet hip-width apart and shoulders back.",
      "Engage your abs and take a breath.",
      "Move the kettlebell to the left in front of your body and switch hands, grabbing it with your left hand.",
      "Continue the rotation by moving the kettlebell around the back of your body.",
      "As the kettlebell reaches your glutes, reach back with your right hand and grab it to continue the rotation.",
      "Keep switching hands as the kettlebell circles your waist, maintaining a steady tempo and tight core.",
      "Complete the reps in one direction, then repeat the same number of reps in the opposite direction.",
    ],
    isCustom: false,
  },

  {
    name: "Kettlebell Clean",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/45301201-Kettlebell-Single-Arm-Clean-(female)_Weightlifts_.mp4",
    howToSteps: [
      "Place the kettlebell on the floor and stand in front of it with your feet hip-width apart.",
      "Bend your knees and hinge at the hips to lean your torso forward, gripping the kettlebell with your right hand.",
      "Engage your abs and take a breath.",
      "Press through your heels to extend your knees while pulling the kettlebell upward in a straight line close to your body.",
      "As the kettlebell reaches hip height, drive your hips forward to generate momentum.",
      "Bend your arm and allow the kettlebell to rotate smoothly onto your shoulder, resting against your forearm and biceps as you exhale.",
      "Lower the kettlebell back to the floor under control and inhale on the way down.",
      "Complete the reps, then switch hands and repeat on the other side.",
    ],
    isCustom: false,
  },

  {
    name: "Kettlebell Curl",
    primaryMuscle: "Biceps",
    secondaryMuscles: [],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/69331201-Kettlebell-Biceps-Curl-(female)_Upper-Arms_.mp4",
    howToSteps: [
      "Hold a pair of kettlebells at your sides with your arms straight and palms facing forward.",
      "Bring your shoulders back and engage your abs.",
      "Take a breath and curl the kettlebells upward, bending your arms until your wrists are slightly higher than your elbows, exhaling at the top.",
      "Slowly lower the kettlebells by extending your arms while breathing in.",
      "Repeat for the desired number of reps.",
    ],
    isCustom: false,
  },

  {
    name: "Kettlebell Goblet Squat",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/23561201-Kettlebell-Goblet-Squat-(female)_Thighs_.mp4",
    howToSteps: [
      "Hold a kettlebell by the horns with both hands, palms facing each other.",
      "Lift the kettlebell in front of your chest with your elbows bent.",
      "Bring your shoulders back and stand with your feet in a comfortable stance, toes slightly pointed out.",
      "Take a breath and engage your abs.",
      "Lower into a squat by bending your knees while keeping your torso upright.",
      "Descend until your thighs are parallel to the floor and your elbows are between your thighs.",
      "Pause briefly at the bottom position.",
      "Press through your heels to stand up, keeping the kettlebell close to your body.",
      "Exhale as you fully straighten your legs.",
    ],
    isCustom: false,
  },

  {
    name: "Kettlebell Halo",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["upper back"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/29391201-Kettlebell-Around-Head-Rotation_Back.mp4",
    howToSteps: [
      "Hold a kettlebell by the horns with neutral wrists and thumbs facing forward.",
      "Stand tall and turn the kettlebell bottoms up so your palms face your body, elbows bent about 90 degrees.",
      "Assume a comfortable stance, lift your chest, and engage your abs.",
      "Inhale and pull the kettlebell up and around the right side of your head, allowing your left forearm to pass over your head.",
      "As the kettlebell moves behind your head, continue the rotation by raising your right forearm overhead.",
      "Bring the kettlebell back to the starting position in front of your chest and exhale.",
      "Repeat the movement in the opposite direction, breathing steadily.",
    ],
    isCustom: false,
  },

  {
    name: "Kettlebell High Pull",
    primaryMuscle: "Full Body",
    secondaryMuscles: ["upper back"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05481201-Kettlebell-Sumo-High-Pull_Back_.mp4",
    howToSteps: [
      "Place a kettlebell on the floor.",
      "Stand with your feet wider than shoulder-width apart and toes pointing out.",
      "Bend your knees and hinge at the hips to grab the kettlebell handle with both hands, keeping your back neutral.",
      "Take a breath and press through your heels to lift the kettlebell.",
      "As the kettlebell reaches hip height, use the momentum to pull it vertically into an upright row, exhaling at the top.",
      "Lower the kettlebell by extending your arms and bending your knees and hips, inhaling on the way down or before the next rep.",
    ],
    isCustom: false,
  },

  {
    name: "Kettlebell Shoulder Press",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["triceps"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/99571201-Kettlebell-Single-Arm-Shoulder-Press-(male)_Should.mp4",
    howToSteps: [
      "Lift a kettlebell to shoulder level with your elbow bent, resting the weight against your forearm and biceps.",
      "Bring your shoulders back, engage your abs, and stand with your feet in a comfortable stance.",
      "Take a breath and press the kettlebell straight overhead, fully extending your arm as you exhale.",
      "Lower the kettlebell back down under control while breathing in.",
      "Repeat for the desired number of reps.",
      "Switch hands and perform the same number of reps on the other side.",
    ],
    isCustom: false,
  },

  {
    name: "Kettlebell Snatch",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05421201-Kettlebell-One-Arm-Snatch_Shoulders_.mp4",
    howToSteps: [
      "Place a kettlebell in front of your body.",
      "Stand with your feet shoulder-width apart and toes slightly pointed out.",
      "Bend your knees and hinge forward to grab the kettlebell.",
      "Stand tall and hold the kettlebell in front of your body.",
      "Bring your shoulders back, engage your abs, and inhale.",
      "Hinge at the hips and swing the kettlebell back between your legs.",
      "Forcefully extend your hips and knees to drive the kettlebell forward and overhead in one smooth motion.",
      "Fully lock out your arm overhead and exhale.",
      "Lower the kettlebell in a controlled, straight path while breathing in.",
      "Repeat for the desired reps, then switch arms and perform the same number of reps.",
    ],
    isCustom: false,
  },

  {
    name: "Kettlebell Swing",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05491201-Kettlebell-Swing_Hips-FIX_.mp4",
    howToSteps: [
      "Hold a kettlebell by the handle with neutral wrists and palms facing each other.",
      "Stand tall with the kettlebell in front of your hips and your feet shoulder-width apart or slightly wider.",
      "Bring your shoulders back, engage your abs, and take a breath.",
      "Hinge at the hips by pushing your glutes back, allowing the kettlebell to swing between your thighs.",
      "Forcefully extend your hips to swing the kettlebell forward up to shoulder height, exhaling at the top.",
      "Let the kettlebell fall naturally and immediately hinge at the hips again to repeat the movement.",
    ],
    isCustom: false,
  },

  {
    name: "Kettlebell Turkish Get Up",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05511201-Kettlebell-Turkish-Get-Up-(Squat-style)_Thighs.mp4",
    howToSteps: [
      "Lie on your back with your right knee bent and right foot flat on the floor, left leg straight.",
      "Hold a kettlebell in your right hand with your wrist, elbow, and shoulder stacked vertically.",
      "Extend your left arm out to the side with your palm flat on the floor.",
      "Engage your abs, inhale, and press through your left arm to raise your torso until you are seated, keeping the kettlebell locked out overhead.",
      "Bend your left leg and place your left knee on the floor, using your left hand for support.",
      "Lift your torso higher and remove your left hand from the floor.",
      "Square your hips into a stable lunge position, inhale, and step your left foot forward.",
      "Stand up by extending your hips and knees while keeping the kettlebell overhead with a straight arm.",
      "Reverse the movement by stepping back into a lunge and lowering your left knee to the floor.",
      "Place your left hand on the floor, extend your left leg forward, and return to a seated position.",
      "Lower your torso under control and lie back down to return to the starting position.",
    ],
    isCustom: false,
  },

  {
    name: "Knee Raise Parallel Bars",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/21261201-Captains-chair-leg-raise_Hips.mp4",
    howToSteps: [
      "Position yourself in a captain’s chair with your back against the pad and forearms resting on the padded parallel bars.",
      "Bring your shoulders back and contract your abs.",
      "Step off the platform and support your body using your upper body, keeping your shoulders stable and avoiding slouching.",
      "Inhale, then raise your knees as high as possible in a smooth motion while engaging your abs, exhaling at the top.",
      "Lower your knees under control, extending them on the way down and stopping before your lower back arches, inhaling as you descend.",
    ],
    isCustom: false,
  },

  {
    name: "Kneeling Pulldown (Band)",
    primaryMuscle: "Lats",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Resistance Band",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/43581201-Band-Knelling-Lat-Pulldown_Back_.mp4",
    howToSteps: [
      "Secure a resistance band to an overhead anchor point.",
      "Grab both band handles, step back, and kneel on the floor.",
      "Lean your torso slightly forward toward the anchor point.",
      "Bring your shoulders back and take a breath.",
      "Pull the band down toward your shoulders while keeping your elbows tucked close to your torso, exhaling as you pull.",
      "Slowly extend your arms back to the starting position while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Kneeling Push Up",
    primaryMuscle: "Chest",
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/32111201-Kneeling-Push-up-(male)_Chest.mp4",
    howToSteps: [
      "Start on the floor on your hands and knees.",
      "Lean forward and place your hands in a comfortable position under your shoulders.",
      "Engage your abs and take a breath.",
      "Lower your body by bending your elbows.",
      "Descend until your face is about an inch from the floor and briefly pause.",
      "Press through your hands to return to the starting position, exhaling as you push up.",
    ],
    isCustom: false,
  },

  {
    name: "L-Sit Hold",
    primaryMuscle: "Abdominals",
    secondaryMuscles: ["triceps"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/14021201-L-sit_Waist.mp4",
    howToSteps: [
      "Position yourself on a captain’s chair or parallel dip bars.",
      "Grip the handles evenly and fully straighten your arms.",
      "Lift your body off the ground and engage your abs.",
      "Take a breath and raise your legs until they are parallel to the floor.",
      "Hold the position for 15 to 60 seconds while maintaining tension, then release.",
    ],
    isCustom: false,
  },

  {
    name: "Landmine 180",
    primaryMuscle: "Abdominals",
    secondaryMuscles: ["shoulders", "upper back", "biceps", "forearms"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05621201-Landmine-180_waist.mp4",
    howToSteps: [
      "Secure one end of a barbell in a landmine attachment and load a weight plate on the opposite end.",
      "Grip the barbell sleeve with both hands, palms supporting the bottom end.",
      "Stand tall with your arms straight, core engaged, and the barbell positioned to your right side.",
      "Take a breath and lift the barbell toward your face by bending your elbows.",
      "Immediately rotate and lower the barbell down to your left side with arms extended, exhaling as you move.",
      "Inhale and lift the barbell back up, then repeat the movement to the opposite side.",
    ],
    isCustom: false,
  },

  {
    name: "Landmine Row",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["lats", "biceps", "forearms"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/32001201-Lever-Bent-over-Row-with-V-bar-(plate-loaded)_Back.mp4",
    howToSteps: [
      "Secure one end of a barbell into a landmine attachment.",
      "Load the desired amount of weight onto the free end of the barbell.",
      "Place a V-handle underneath the barbell shaft near the sleeve.",
      "Grip the handle firmly with both hands, keeping it tight against the barbell.",
      "Bend your knees slightly, retract your shoulder blades, and engage your abs.",
      "Lift the barbell a few inches off the floor and take a breath.",
      "Row the barbell toward your upper stomach, pausing briefly at the top as you exhale.",
      "Lower the barbell under control by extending your arms while breathing in, without resting it on the floor.",
    ],
    isCustom: false,
  },

  {
    name: "Landmine Squat and Press",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/29761201-Landmine-Squat-and-Press_.mp4",
    howToSteps: [
      "Anchor one end of a barbell in a landmine attachment and load a weight plate on the other end.",
      "Grip the free end of the barbell with both hands.",
      "Stand tall with your hands together in front of your chest.",
      "Set your feet in a comfortable squat stance.",
      "Engage your abs, take a breath, and descend into a squat.",
      "Lower until your thighs are parallel to the floor, then press through your heels to stand up.",
      "As you extend your legs, immediately press the barbell overhead and exhale at the top.",
      "Lower the barbell back to chest level under control, inhale, and descend into the next squat.",
    ],
    isCustom: false,
  },

  {
    name: "Lat Pulldown (Band)",
    primaryMuscle: "Lats",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Resistance Band",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/31161201-Band-Fixed-Back-Underhand-Pulldown_Back_.mp4",
    howToSteps: [
      "Secure a resistance band to an overhead anchor point such as a pull-up bar.",
      "Grab both ends of the band, straighten your arms, step back to create tension, and sit on a bench or kneel on the floor.",
      "Lean slightly toward the band anchor point.",
      "Take a breath and pull the band down to your upper chest, squeezing your lats as you exhale.",
      "Slowly extend your arms back to the starting position while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Lat Pulldown (Cable)",
    primaryMuscle: "Lats",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/01501201-Cable-Bar-Lateral-Pulldown_Back.mp4",
    howToSteps: [
      "Adjust the knee pad so it fits snugly against your thighs.",
      "Select a weight that allows you to perform at least ten controlled repetitions.",
      "Grab the bar with your hands slightly wider than shoulder-width apart, palms facing forward.",
      "Sit down and secure your legs underneath the pad.",
      "With your arms fully extended, pull your shoulders back and down.",
      "Take a breath and pull the bar down by driving your elbows toward your sides, exhaling as you pull.",
      "Pause briefly at the bottom, then fully extend your arms while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Lat Pulldown (Machine)",
    primaryMuscle: "Lats",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05791201-Lever-Front-Pulldown_Back.mp4",
    howToSteps: [
      "Select an appropriate load on the machine.",
      "Adjust the thigh pad so your legs fit snugly underneath.",
      "Stand up and grab the handles with an even overhand grip, palms facing forward.",
      "Sit down while keeping your arms straight and secure your legs under the pad.",
      "Bring your shoulders back and take a breath.",
      "Pull the handles down by tucking your elbows and keeping them in line with your torso, exhaling as you pull.",
      "Slowly extend your arms back to the starting position while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Lat Pulldown - Close Grip (Cable)",
    primaryMuscle: "Lats",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/63921201-Cable-Lateral-Pulldown-with-Mag-Grip_Back_.mp4",
    howToSteps: [
      "Attach a V-handle to the lat pulldown machine.",
      "Select an appropriate load.",
      "Adjust the thigh pad so your legs fit snugly underneath.",
      "Grab the V-handle with a neutral grip, sit down, and secure your thighs under the pad.",
      "Bring your shoulders back and lean your torso slightly backward.",
      "Inhale and pull the handle down to your chest, squeezing your back muscles as you exhale.",
      "Slowly extend your arms back to the starting position while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Lateral Band Walks",
    primaryMuscle: "Glutes",
    secondaryMuscles: [],
    equipment: "Resistance Band",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/24601201-Resistance-Band-Lateral-Walk-(female)_Hips_.mp4",
    howToSteps: [
      "Place a looped resistance band around your ankles or thighs just above the knees.",
      "Hinge slightly at the hips and bend your knees to assume an athletic stance.",
      "Engage your abs and take a breath.",
      "Step laterally to the right, maintaining tension on the band, and exhale.",
      "Inhale and take another step in the same direction.",
      "After completing the steps to one side, reverse direction and take the same number of steps to the left while breathing steadily.",
    ],
    isCustom: false,
  },

  {
    name: "Lateral Box Jump",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes", "calves"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05641201-Lateral-Box-Jump-(female)_Plyometrics-FIX_.mp4",
    howToSteps: [
      "Stand sideways next to a plyometric box or flat gym bench.",
      "Keep your feet close together, arms at your sides, and body upright.",
      "Take a breath, dip into a quarter squat, and swing your arms back.",
      "Drive through your heels and swing your arms forward to jump laterally and upward, exhaling as you jump.",
      "Land softly on the box, then carefully step down on the opposite side while breathing in.",
      "Jump laterally back in the opposite direction.",
      "Continue alternating sides with controlled, rhythmic jumps.",
    ],
    isCustom: false,
  },

  {
    name: "Lateral Leg Raises",
    primaryMuscle: "Glutes",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/86421201-Standing-Single-Side-Leg-Raise-Chair-Supported-(fe.mp4",
    howToSteps: [
      "Stand tall with your feet together, legs straight, and shoulders back.",
      "Hold onto a stable object such as a chair or squat rack for balance.",
      "Engage your abs and take a breath.",
      "Raise your right leg out to the side as high as possible in a smooth motion, exhaling as you lift.",
      "Lower your leg back to the starting position while breathing in.",
      "Complete the reps, then repeat with the opposite leg.",
    ],
    isCustom: false,
  },

  {
    name: "Lateral Lunge",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/29721201-Side-Lunge_Thighs.mp4",
    howToSteps: [
      "Stand tall with your feet a few inches apart and toes slightly pointed out.",
      "Bring your shoulders back, engage your abs, and hold your hands in front of your chest.",
      "Take a breath and step your left leg out to the side, planting your foot flat on the floor.",
      "Bend your left knee to sink into a lateral lunge while keeping your right leg straight.",
      "Lower until your left thigh is nearly parallel to the floor and pause briefly.",
      "Press through your left heel to return to the starting position, exhaling as you stand up.",
      "Inhale and repeat the movement on the right side.",
      "Continue alternating sides in a controlled manner.",
    ],
    isCustom: false,
  },

  {
    name: "Lateral Raise (Band)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: [],
    equipment: "Resistance Band",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/09071201-Band-Lateral-Raise-(female)_Shoulders_.mp4",
    howToSteps: [
      "Step on the middle of an open-ended resistance band with handles on both ends.",
      "Hold the handles at your sides.",
      "Bring your shoulders back, engage your abs, and lean your torso slightly forward so your hands are in front of your hips.",
      "Raise your arms out to the sides in a smooth motion until your shoulders, elbows, and wrists are aligned, exhaling at the top.",
      "Lower your arms back to the starting position under control while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Lateral Raise (Cable)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/01781201-Cable-Lateral-Raise_shoulder.mp4",
    howToSteps: [
      "Set the pulleys on a dual cable machine to the lowest position and attach handles.",
      "Select an appropriate weight on both stacks.",
      "Step to the left and grab the right handle with your right hand.",
      "Step to the right and grab the left handle with your left hand.",
      "Stand centered with your arms straight and hands positioned in front of your hips.",
      "Engage your abs, retract your shoulder blades, and inhale.",
      "Raise both arms out to the sides in a smooth motion until your shoulders, elbows, and wrists are aligned, exhaling at the top.",
      "Lower your arms back to the starting position under control while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Lateral Raise (Dumbbell)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: [],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/03341201-Dumbbell-Lateral-Raise_shoulder.mp4",
    howToSteps: [
      "Hold a pair of light dumbbells and stand tall.",
      "Bring your shoulders back, engage your abs, and take a breath.",
      "Raise both arms out to the sides until your elbows and wrists align with your shoulders, exhaling at the top.",
      "Lower the dumbbells back to your sides under control while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Lateral Raise (Machine)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05841201-Lever-Lateral-Raise_shoulder.mp4",
    howToSteps: [
      "Select an appropriate load and adjust the seat height.",
      "Sit down with your back supported and bring your shoulders back against the pad.",
      "Grab the handles at your sides and place your forearms flat against the pads.",
      "Inhale, then raise your arms out to the sides in a smooth motion until your elbows reach shoulder height, exhaling at the top.",
      "Lower your arms back to the starting position under control while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Lateral Squat",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/69241201-Side-Step-Deep-Squat-(male)_Plyometrics_.mp4",
    howToSteps: [
      "Stand with your feet hip-width apart and toes slightly pointed out.",
      "Raise your arms in front of your body for balance.",
      "Inhale, step your left leg out to the side, plant your foot, and descend into a squat.",
      "Lower as deep as your strength and mobility allow while keeping control.",
      "Pause briefly at the bottom, then press forcefully through your heels to stand up as you exhale.",
      "Inhale and repeat the movement by stepping your right leg out to the side.",
      "Continue alternating sides in a controlled manner.",
    ],
    isCustom: false,
  },

  {
    name: "Leg Extension (Machine)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05851201-Lever-Leg-Extension_Thighs.mp4",
    howToSteps: [
      "Select an appropriate load on the machine.",
      "Adjust the pad so it rests against your lower legs just above your feet when seated.",
      "Sit down, grip the handles at your sides, place your shins against the pad, and retract your shoulders.",
      "Take a breath and extend your legs by contracting your quadriceps.",
      "Lift the weight until your knees are fully straightened, exhaling at the top.",
      "Pause briefly, then slowly bend your knees to lower the weight while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Leg Press (Machine)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/07391201-Sled-45-Leg-Press_Hips.mp4",
    howToSteps: [
      "Load the desired weight onto the leg press machine and sit down.",
      "Place your feet flat on the platform in a comfortable stance with toes slightly pointed out.",
      "Grip the side handles, bring your shoulders back, and engage your abs.",
      "Press the platform away and straighten your legs, rotating the handles to disengage the safety pins.",
      "Inhale and lower the platform by bending your knees under control.",
      "Pause briefly at the bottom, then press the platform away as you exhale.",
      "After completing the set, straighten your legs, rotate the handles to re-engage the safety pins, and rest.",
    ],
    isCustom: false,
  },

  {
    name: "Leg Press Horizontal (Machine)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/22671201-Lever-Seated-Leg-Press_Thighs.mp4",
    howToSteps: [
      "Select an appropriate load on the machine and sit down.",
      "Place your feet flat on the platform at a comfortable width.",
      "Bring your shoulders back, engage your abs, and grip the handles at your sides.",
      "Take a breath and press the platform forward until your legs are fully extended, exhaling as you push.",
      "Lower the platform under control by bending your knees while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Leg Raise Parallel Bars",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/29631201-Captains-Chair-Straight-Leg-Raise_Waist-FIX_.mp4",
    howToSteps: [
      "Position yourself on a captain’s chair with your forearms resting on the horizontal pads and hands gripping the handles.",
      "Bring your feet together and engage your abs, pressing your lower back against the back support.",
      "Take a breath and raise your legs in one smooth motion as high as possible, exhaling at the top.",
      "Lower your legs slowly under control while keeping tension on your abs, breathing in and avoiding lower back arching.",
    ],
    isCustom: false,
  },

  {
    name: "Low Cable Fly Crossovers",
    primaryMuscle: "Chest",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/01791201-Cable-Low-Fly_Chest.mp4",
    howToSteps: [
      "Select an appropriate load on the cable machine.",
      "Set both pulleys to the lowest position and attach handles.",
      "Grab the handles one at a time and stand centered with your arms at your sides.",
      "Stagger your stance slightly, bring your shoulders back, and engage your abs.",
      "Inhale, then raise your arms upward and inward, lightly tapping the handles together while squeezing your chest and exhaling.",
      "Slowly return your arms back to your sides under control while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Low Row (Suspension)",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["lats", "biceps", "forearms"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/10921201-Suspender-Row-(female)_Back_.mp4",
    howToSteps: [
      "Hold the handles of a suspension trainer with your arms extended in front of your body.",
      "Walk your feet forward to lean your body back at a comfortable angle.",
      "Bring your shoulders back, engage your abs, and squeeze your glutes.",
      "Take a breath and pull your body toward the handles by squeezing your back muscles, exhaling at the top.",
      "Slowly extend your arms to return to the starting position while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Lunge",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/14601201-Walking-Lunge-Male_Hips.mp4",
    howToSteps: [
      "Stand tall with your shoulders back, hands on your hips, and eyes facing forward.",
      "Engage your abs and take a breath.",
      "Step forward with your right leg and plant your foot firmly on the floor.",
      "Lower your body by bending your knees until your back knee gently touches the floor.",
      "Press through your front heel to return to a standing position, exhaling as you rise.",
      "Step forward with the opposite leg and repeat the lunge.",
    ],
    isCustom: false,
  },

  {
    name: "Lunge (Barbell)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00541201-Barbell-Lunge_Thighs.mp4",
    howToSteps: [
      "Place a barbell across your upper back and grip it securely for support.",
      "Stand with your feet hip-width apart and toes slightly pointed out.",
      "Take a breath and step forward, planting your foot flat on the floor.",
      "Lower into a lunge while keeping your torso upright and stable.",
      "Descend until your back knee is an inch or two above the floor.",
      "Press through your front heel to return to the starting position, exhaling as you stand.",
      "Inhale and step forward with the opposite leg.",
      "Continue alternating lunges in a controlled manner.",
    ],
    isCustom: false,
  },

  {
    name: "Lunge (Dumbbell)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/03361201-Dumbbell-Lunge_Hips.mp4",
    howToSteps: [
      "Hold a pair of dumbbells at your sides and stand tall.",
      "Bring your shoulders back, engage your abs, and set your feet in a comfortable stance.",
      "Take a breath and step forward with one leg, planting your foot firmly on the floor.",
      "Lower into a lunge until your front thigh is nearly parallel to the floor and your back knee hovers an inch or two above the ground.",
      "Press through your front heel to return to the starting position, exhaling as you rise.",
      "Inhale and repeat the movement with the opposite leg.",
      "Continue alternating lunges in a controlled manner.",
    ],
    isCustom: false,
  },

  {
    name: "Lying Knee Raise",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/81941201-Lying-Knee-Raise-(male)_Waist_.mp4",
    howToSteps: [
      "Lie flat on the floor with your feet together, arms at your sides, and body straight.",
      "Engage your abs and lift your feet slightly off the floor while keeping your lower back pressed into the ground.",
      "Take a breath and raise your legs by bending your knees to about a 90-degree angle, exhaling as you lift.",
      "Slowly lower your legs back toward the starting position while straightening your knees, breathing in and keeping your feet off the floor.",
    ],
    isCustom: false,
  },

  {
    name: "Lying Leg Curl (Machine)",
    primaryMuscle: "Hamstrings",
    secondaryMuscles: ["calves"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05861201-Lever-Lying-Leg-Curl_Thighs.mp4",
    howToSteps: [
      "Select an appropriate load and adjust the pad so it rests over your Achilles tendon just above the heels when lying down.",
      "Lie face down on the machine, grip the handles, and position the backs of your lower legs against the pad.",
      "Take a breath and contract your hamstrings to curl the pad upward.",
      "Continue curling until your lower legs are nearly vertical, exhaling at the top.",
      "Pause briefly, then slowly extend your knees to lower the weight while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Lying Leg Raise",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/11631201-Lying-Leg-Raise_Waist.mp4",
    howToSteps: [
      "Lie flat on the floor with your legs straight, arms at your sides, and palms pressed into the floor.",
      "Engage your abs, bring your legs together, and take a breath.",
      "Lift your legs upward until your heels point toward the ceiling, exhaling as you raise them.",
      "Lower your legs slowly under control without letting your feet touch the floor, breathing in and maintaining slight rounding in your lower back.",
    ],
    isCustom: false,
  },

  {
    name: "Meadows Rows (Barbell)",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["lats", "biceps", "forearms"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/40381201-Landmine-One-Arm-Bent-Over-Row_Back_.mp4",
    howToSteps: [
      "Secure one end of a barbell in a landmine attachment or wedge it safely against a wall.",
      "Load weight onto the free end of the barbell.",
      "Stand perpendicular to the loaded end of the bar with one side of your body facing it.",
      "Take a staggered stance, hinge forward at the hips, and grab the barbell sleeve with the hand closest to the weight.",
      "Lift your torso slightly so the loaded end of the barbell rises an inch or two off the floor with your arm straight.",
      "Bring your shoulders back, inhale, and row the barbell up and close to your body, squeezing your lat and exhaling as your elbow reaches about 90 degrees.",
      "Lower the barbell under control by extending your arm while breathing in, keeping your shoulder from rolling forward.",
      "After completing the reps on one side, turn around and repeat with the opposite arm.",
    ],
    isCustom: false,
  },

  {
    name: "Mountain Climber",
    primaryMuscle: "Full Body",
    secondaryMuscles: ["abdominals", "shoulders", "quadriceps"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/75311201-Plank-Alternate-Knee-Tuck-(female)_Waist_.mp4",
    howToSteps: [
      "Start on all fours with your hands flat on the floor under your shoulders.",
      "Straighten your legs back so your body is supported on your hands and toes.",
      "Engage your core and lift your hips slightly, keeping your back neutral.",
      "In one fluid motion, tuck your right knee toward your chest while exhaling.",
      "Extend your right leg back as you inhale.",
      "Tuck your left knee toward your chest and exhale.",
      "Continue alternating legs at a steady, controlled tempo.",
    ],
    isCustom: false,
  },

  {
    name: "Muscle Up",
    primaryMuscle: "Full Body",
    secondaryMuscles: [
      "lats",
      "upper back",
      "biceps",
      "triceps",
      "shoulders",
      "abdominals",
    ],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/51941201-Bodyweight-Muscle-Up-(VERSION-2)_Back_.mp4",
    howToSteps: [
      "Stand underneath a pull-up bar, jump up, and grab it with a double overhand grip.",
      "Engage your core, pull your shoulder blades back, and keep your legs straight with feet together.",
      "As your body begins to swing back, pull yourself up explosively, aiming to bring your chest above the bar.",
      "Use the momentum to transition your chest over the bar.",
      "Perform a straight bar dip by extending your elbows, exhaling near the top.",
      "Lower yourself in control by bending your elbows and moving your body back down.",
      "Swing smoothly to build momentum and begin the next repetition.",
    ],
    isCustom: false,
  },

  {
    name: "Negative Pull Up",
    primaryMuscle: "Lats",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/47741201-Pull-up-(negative)-(female)_Back_.mp4",
    howToSteps: [
      "Place a sturdy stool, bench, or plyo box underneath a pull-up bar.",
      "Step onto the object and grab the bar with an overhand grip, elbows bent around 90 degrees.",
      "Take a deep breath and engage your core.",
      "Step off the object and slowly lower your body by extending your arms against gravity.",
      "Once your arms are fully extended, step back onto the object and repeat.",
    ],
    isCustom: false,
  },

  {
    name: "Nordic Hamstrings Curls",
    primaryMuscle: "Hamstrings",
    secondaryMuscles: ["glutes"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/77461201-Nordic-Hamstring-Curl-(male)_Thighs_.mp4",
    howToSteps: [
      "Kneel on the floor and secure your feet under a loaded barbell or another sturdy object.",
      "Pull your shoulders back, engage your core, and squeeze your glutes.",
      "Position your arms by your sides or in front of your torso for balance and support.",
      "Take a breath and slowly lower your torso toward the floor by extending your knees, keeping your hips stable.",
      "Lower yourself as far as your strength allows, then use your hamstrings and glutes to return to an upright position, exhaling near the top.",
    ],
    isCustom: false,
  },

  {
    name: "Oblique Crunch",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/06351201-Oblique-Crunches-Floor_Waist.mp4",
    howToSteps: [
      "Lie on your right side with your knees bent and legs stacked.",
      "Place your left hand behind your head for support.",
      "Take a breath and engage your obliques to crunch your torso, lifting your right shoulder off the floor while exhaling.",
      "Lower your shoulder back to the floor as you inhale.",
      "Repeat for the desired number of reps.",
      "Switch sides and perform the same number of repetitions on the opposite side.",
    ],
    isCustom: false,
  },

  {
    name: "One Arm Push Up",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/07251201-Single-Arm-Push-up_Chest.mp4",
    howToSteps: [
      "Start on all fours on the floor.",
      "Extend your legs back and support your body on your toes, spreading your feet wider than hip-width for stability.",
      "Place your hands about shoulder-width apart.",
      "Engage your core to keep your body tight.",
      "Lift one hand off the floor and place it behind your back.",
      "Take a breath and lower your body by bending the supporting arm, keeping your torso stable.",
      "Lower as far as you can, ideally until your chest is a few inches from the floor.",
      "Press through your hand to return to the starting position and exhale.",
      "Switch sides and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Overhead Curl (Cable)",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["forearms"],
    equipment: "Cable",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/16361201-Cable-Overhead-Curl_Upper-Arms.mp4",
    howToSteps: [
      "Set the pulleys of a dual cable machine to the highest position.",
      "Select an appropriate weight on both stacks and attach handles to the pulleys.",
      "Grab the handles and stand centered between the cables with your arms extended out to your sides.",
      "Pull your shoulders back and engage your core.",
      "Bend your arms simultaneously, bringing the handles toward the sides of your head while exhaling.",
      "Slowly extend your arms back to the starting position as you inhale.",
    ],
    isCustom: false,
  },

  {
    name: "Overhead Dumbbell Lunge",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: [
      "hamstrings",
      "glutes",
      "shoulders",
      "triceps",
      "upper back",
    ],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/50761201-Dumbbell-Overhead-Lunge_Thighs_.mp4",
    howToSteps: [
      "Grab a pair of dumbbells and stand tall.",
      "Raise the dumbbells overhead and fully extend your arms.",
      "Pull your shoulders back, engage your core, and take a breath.",
      "Step forward with your right leg and plant your foot firmly on the floor.",
      "Lower into a lunge until your front thigh is nearly parallel to the floor.",
      "Press through your front heel to return to the starting position while exhaling.",
      "Take another breath and step forward with the opposite leg.",
      "Continue alternating legs for the desired number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Overhead Plate Raise",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["upper back"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/101141201-Weighted-Plate-LU-Raise-(male)_Shoulders_.mp4",
    howToSteps: [
      "Grip a weight plate by placing your middle and ring fingers through the center hole and securing the plate with your thumb, index finger, and pinky.",
      "Grab a second plate the same way with your other hand.",
      "Stand tall with your arms extended at your sides, plates hanging down and wrists neutral.",
      "Lift your chest, engage your core, and inhale.",
      "Raise the plates out to your sides and overhead in a smooth arc, bringing your knuckles toward each other at the top while exhaling.",
      "Slowly lower the plates back to your sides in the same arc while inhaling.",
      "Repeat for the desired number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Overhead Press (Barbell)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["triceps", "abdominals"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/11651201-Barbell-Standing-Military-Press-(without-rack)_Shoulders.mp4",
    howToSteps: [
      "Set the barbell at collarbone height on a rack or stand.",
      "Grip the bar with an overhand grip, hands about shoulder-width apart.",
      "Step under the bar, retract your shoulders, engage your core, and take a breath.",
      "Unrack the barbell and take a couple of steps back.",
      "Stand with your feet hip-width apart and the bar resting at upper chest level.",
      "Take another breath and press the bar straight overhead, moving your head slightly back to clear the bar path.",
      "Press until your arms are fully extended and exhale near the top.",
      "Lower the bar back down in a straight line to neck or upper chest level while inhaling.",
      "Step forward and carefully rack the barbell once finished.",
    ],
    isCustom: false,
  },

  {
    name: "Overhead Press (Dumbbell)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["triceps"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/04261201-Dumbbell-Standing-Overhead-Press_shoulder.mp4",
    howToSteps: [
      "Grab a pair of dumbbells and stand tall.",
      "Pull your shoulders back, engage your core, and squeeze your glutes for stability.",
      "Take a breath and raise the dumbbells to your sides, bending your elbows to about 90 degrees.",
      "Inhale, then press the dumbbells up and slightly inward, lightly tapping them together at the top while exhaling.",
      "Lower the dumbbells back down with control while inhaling.",
      "Stop when your elbows are slightly below shoulder level and begin the next repetition.",
    ],
    isCustom: false,
  },

  {
    name: "Overhead Press (Smith Machine)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["triceps"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/12241201-Smith-Standing-Shoulder-Press_Shoulders.mp4",
    howToSteps: [
      "Set the Smith machine bar at collarbone height and load the desired weight plates.",
      "Stand in front of the bar and grip it with an even overhand grip, hands shoulder-width apart.",
      "Pull your shoulders back, engage your core, and take a breath.",
      "Unrack the bar from the hooks.",
      "Take another breath and press the bar straight overhead, exhaling near the top.",
      "Lower the bar back down with control while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Overhead Squat",
    primaryMuscle: "Full Body",
    secondaryMuscles: [
      "quadriceps",
      "glutes",
      "hamstrings",
      "abdominals",
      "upper back",
      "shoulders",
    ],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00691201-Barbell-Overhead-Squat_Thighs-FIX_.mp4",
    howToSteps: [
      "Grip the barbell with a wide overhand grip, comfortable for your shoulders.",
      "Press the barbell overhead and fully extend your arms.",
      "Pull your shoulders back, engage your core, and set your feet in a stable squat stance.",
      "Take a breath and begin descending into the squat.",
      "Keep your heels planted and lower until your thighs are parallel to the floor.",
      "Pause briefly at the bottom, then press through your heels to stand back up.",
      "Fully extend your hips and knees, exhaling near the top while keeping the barbell directly overhead.",
    ],
    isCustom: false,
  },

  {
    name: "Overhead Triceps Extension (Cable)",
    primaryMuscle: "Triceps",
    secondaryMuscles: [],
    equipment: "Cable",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/01941201-Cable-Overhead-Triceps-Extension-(rope-attachment)_Upper-Arms-FIX_.mp4",
    howToSteps: [
      "Set the cable pulley to mid-thigh height, attach a rope handle, and select an appropriate load.",
      "Grab both ends of the rope with an overhand grip, palms facing your body.",
      "Turn away from the machine and dip slightly to bring the rope overhead, positioning it behind your head with elbows bent.",
      "Keep your chest up, lean slightly forward, stagger your stance for balance, and brace your core.",
      "Inhale, then extend your elbows to press the rope upward, spreading the rope at the top while exhaling.",
      "Slowly bend your elbows to return to the starting position while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Partial Glute Bridge (Barbell)",
    primaryMuscle: "Glutes",
    secondaryMuscles: ["hamstrings"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/54511201-Barbell-KAS-Glute-Bridge-(female)_Hips_.mp4",
    howToSteps: [
      "Sit on the floor with a loaded barbell resting over your hips and your upper back supported against the edge of a flat bench.",
      "Hold the bar evenly for stability and plant your feet flat on the floor with toes slightly pointed out.",
      "Brace your core, inhale, and press your hips up into the barbell.",
      "Drive through your heels and engage your glutes to lift your hips toward the ceiling.",
      "Pause when your hips align with your torso, squeeze your glutes, and exhale.",
      "Lower your hips only a few inches while inhaling, keeping your core tight.",
      "Stop before your knees begin drifting back toward your hips, then drive your hips up again while exhaling.",
      "Repeat for the desired number of partial-range repetitions, then lower your hips to the floor.",
    ],
    isCustom: false,
  },

  {
    name: "Pause Squat (Barbell)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/50161201-Barbell-Pause-Full-Squat_Thighs_.mp4",
    howToSteps: [
      "Set the barbell at collarbone height on a rack and load the desired weight.",
      "Place your hands evenly on the bar and grip it firmly.",
      "Duck your head under the bar and position it securely across your upper back.",
      "Brace your entire body and extend your knees to unrack the bar.",
      "Take a few careful steps back, set your feet in a comfortable squat stance, take a deep breath, and engage your core.",
      "Descend into a squat to a comfortable depth and pause for two to three seconds.",
      "Drive through your heels to stand back up, exhaling as you reach the top.",
    ],
    isCustom: false,
  },

  {
    name: "Pendlay Row (Barbell)",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["lats", "biceps", "forearms"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/30171201-Barbell-Pendlay-Row_Back_.mp4",
    howToSteps: [
      "Stand in front of a barbell with your feet in a comfortable stance and toes slightly pointed out.",
      "Hinge at the hips and grab the bar with a double overhand grip.",
      "Pull your shoulders back to flatten your back, keeping your shoulders slightly in front of the bar and higher than your hips.",
      "Take a breath and row the bar explosively toward your chest while exhaling.",
      "Lower the barbell under control back to the floor while inhaling.",
      "Let the bar come to a complete stop on the floor before beginning the next repetition.",
    ],
    isCustom: false,
  },

  {
    name: "Pendulum Squat (Machine)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/49511201-Lever-Pendulum-Squat-(plate-loaded)_Thighs_.mp4",
    howToSteps: [
      "Load the appropriate amount of weight plates onto the machine.",
      "Step onto the platform and position your upper back firmly against the pads.",
      "Set your feet in a comfortable squat stance with toes slightly pointed outward.",
      "Grab the handles at the sides of your head or in front of you.",
      "Retract your shoulder blades, engage your core, and take a deep breath.",
      "Extend your knees fully to lift the weight and use the handles to unrack the machine.",
      "Lower into a squat until your knees reach about a 90-degree angle, pausing briefly at the bottom.",
      "Press through your heels to return to the top position while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Pike Pushup",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["triceps"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/29211201-Pike-Push-up_Chest.mp4",
    howToSteps: [
      "Start on all fours with your hands and knees on the floor.",
      "Extend your legs back and support your body on your toes.",
      "Push your hips up toward the ceiling to form a pike position.",
      "Keep your shoulders pulled back and your spine neutral.",
      "Take a breath and bend your elbows to lower your head toward the floor.",
      "Lower until your forehead is close to the floor, then press back up while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Pinwheel Curl (Dumbbell)",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["forearms"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/16571201-Dumbbell-Cross-Body-Hammer-Curl-(Version-2)_Upper-Arms-FIX.mp4",
    howToSteps: [
      "Grab a pair of dumbbells and stand tall with your shoulders back and chest lifted.",
      "Hold the dumbbells slightly in front of your thighs with your palms facing inward.",
      "Take a breath and curl one dumbbell across your body toward your chest while exhaling.",
      "Lift until the dumbbell reaches slightly higher than your elbow.",
      "Lower the dumbbell back to the starting position with control while inhaling.",
      "Repeat with the opposite arm.",
      "Continue alternating arms for the desired number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Pistol Squat",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/17591201-Single-Leg-Squat-(pistol)-(male)_Thighs-FIX2_.mp4",
    howToSteps: [
      "Stand tall with your arms extended forward, feet flat on the floor, shoulders back, and core engaged.",
      "Lift one foot slightly off the floor and take a breath.",
      "Lower into a squat by bending the supporting knee, allowing the free leg to extend in front of your body.",
      "Descend as low as possible, ideally until your thigh is parallel to the floor.",
      "Press through the heel of your supporting foot to return to the standing position while exhaling.",
      "Switch legs and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Plank",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/04631201-Front-Plank-m_waist.mp4",
    howToSteps: [
      "Get down on the floor.",
      "Extend your body, supporting your upper body on your forearms and your lower body on your toes.",
      "Keep your shoulders neutral and engage your core.",
      "Hold the position for as long as possible while breathing steadily.",
    ],
    isCustom: false,
  },

  {
    name: "Plank Pushup",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps", "abdominals"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/29781201-Elbow-Up-and-Down-Dynamic-Plank.mp4",
    howToSteps: [
      "Start on all fours on the floor.",
      "Extend your legs back and support your body on your toes.",
      "Place your forearms on the floor with your elbows positioned under your shoulders.",
      "Engage your core and take a breath.",
      "Press one hand at a time into the floor to extend your arms and rise into a high plank, exhaling as both arms straighten.",
      "Lower back down by placing your forearms on the floor while inhaling.",
      "Continue alternating between forearm plank and high plank positions.",
    ],
    isCustom: false,
  },

  {
    name: "Plate Curl",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["forearms"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/66981201-Weighted-Plate-Standing-Biceps-Curl-(male)_Forearm.mp4",
    howToSteps: [
      "Hold a weight plate by its sides and position it in front of your hips.",
      "Pull your shoulders back and engage your core.",
      "Take a breath and curl the plate upward until your wrists are slightly higher than your elbows, exhaling at the top.",
      "Lower the plate back down under control while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Plate Front Raise",
    primaryMuscle: "Shoulders",
    secondaryMuscles: [],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/08341201-Weighted-Front-Raise_Shoulders.mp4",
    howToSteps: [
      "Grab a weight plate and hold it by the sides with your arms fully extended.",
      "Pull your shoulders back, stand with a comfortable stance, look forward, and take a breath.",
      "Engage your core and lift the plate straight up in front of your body while exhaling.",
      "Raise the plate until it reaches shoulder height, keeping your arms straight.",
      "Lower the plate back down to hip level under control while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Plate Press",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/12251201-Standing-Plate-Press_Chest_.mp4",
    howToSteps: [
      "Hold a weight plate by its sides and position it in front of your chest.",
      "Stand with your feet in a comfortable stance, engage your core, and retract your shoulder blades.",
      "Take a breath and press the plate straight forward until your arms are fully extended, exhaling as you press.",
      "Bend your arms with control to bring the plate back to your chest while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Plate Squeeze (Svend Press)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/08561201-Weighted-Svend-Press_Chest.mp4",
    howToSteps: [
      "Grab a weight plate and stand tall.",
      "Squeeze the plate firmly between your hands and lift it to chest level.",
      "Pull your shoulders back, engage your core, and set your feet in a comfortable stance.",
      "Take a breath and press the plate straight forward until your arms are fully extended, exhaling as you press.",
      "Slowly bring the plate back to your chest while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Power Clean",
    primaryMuscle: "Full Body",
    secondaryMuscles: [
      "quadriceps",
      "hamstrings",
      "glutes",
      "upper back",
      "shoulders",
      "abdominals",
    ],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/06481201-Power-Clean_Thighs.mp4",
    howToSteps: [
      "Stand in front of a loaded barbell with your feet under the bar and your shins a few inches away.",
      "Hinge down and grab the bar with an even overhand grip.",
      "Lift your chest, keeping your back neutral and your hips slightly higher than your knees.",
      "Initiate the lift by driving through your heels and pulling the barbell powerfully off the floor.",
      "As the bar passes your knees, explosively extend your hips and pull the bar straight upward in one smooth motion.",
      "Quickly drop into a squat and catch the bar on your shoulders in a front rack position.",
      "Stand up fully by extending your knees and hips, exhaling at the top.",
      "Lower the barbell back to the floor with control while maintaining a neutral spine.",
    ],
    isCustom: false,
  },

  {
    name: "Power Snatch",
    primaryMuscle: "Full Body",
    secondaryMuscles: [
      "quadriceps",
      "hamstrings",
      "glutes",
      "upper back",
      "shoulders",
      "abdominals",
    ],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/15301201-Barbell-Power-Snatch_Weightlifts_.mp4",
    howToSteps: [
      "Stand in front of a loaded barbell with your feet positioned under the bar and shins a few inches away.",
      "Grip the bar with a wide overhand grip that is comfortable for your shoulders.",
      "Lower your hips until your shins lightly contact the bar and lift your chest to flatten your back.",
      "Take a breath and brace your core.",
      "Pull the barbell straight up, keeping it close to your shins.",
      "As the bar passes your knees, explosively extend your hips and initiate a powerful second pull.",
      "Continue pulling the bar upward in a straight line to chest height.",
      "Quickly bend your knees and drop under the bar, catching it overhead with arms fully extended.",
      "Stand up fully by extending your legs and exhaling.",
      "Lower the barbell back to the floor under control while keeping it close to your body.",
    ],
    isCustom: false,
  },

  {
    name: "Preacher Curl (Barbell)",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["forearms"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00701201-Barbell-Preacher-Curl_Upper-Arms.mp4",
    howToSteps: [
      "Load the barbell and adjust the preacher bench seat so your upper arms rest comfortably on the pad.",
      "Grab the bar with an even underhand grip, lift it, and sit down with your torso upright.",
      "Pull your shoulders back, engage your core, and inhale.",
      "Lower the bar slowly until your arms are almost fully extended.",
      "Curl the bar upward until your forearms are nearly vertical, exhaling at the top.",
      "Lower the bar back down under control while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Preacher Curl (Dumbbell)",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["forearms"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/04021201-Dumbbell-Seated-Preacher-Curl_Upper-Arms.mp4",
    howToSteps: [
      "Adjust the preacher bench seat so the backs of your upper arms rest comfortably against the pad.",
      "Grab a pair of dumbbells and sit down on the bench.",
      "Place your arms on the pad with your elbows bent and palms facing your body.",
      "Engage your core and take a breath.",
      "Lower the dumbbells slowly until your arms are fully extended.",
      "Curl the dumbbells upward until your forearms are nearly vertical, exhaling at the top.",
    ],
    isCustom: false,
  },

  {
    name: "Preacher Curl (Machine)",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["forearms"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05921201-Lever-Preacher-Curl_Upper-Arms.mp4",
    howToSteps: [
      "Select the appropriate weight on the machine.",
      "Adjust the seat height so your upper arms and triceps rest comfortably against the pad.",
      "Sit down, fully extend your arms, and grab the handles.",
      "Engage your core and take a breath.",
      "Curl the handles upward by bending your elbows until your forearms are nearly upright, exhaling at the top.",
      "Slowly extend your arms back to the starting position while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Pull Up",
    primaryMuscle: "Lats",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/06521201-Pull-up_Back.mp4",
    howToSteps: [
      "Stand underneath a pull-up bar.",
      "Reach up and grab the bar with an even overhand grip, hands slightly wider than shoulder-width.",
      "Pull your shoulders back and engage your core.",
      "Bend your knees to lift your feet off the floor and hang from the bar.",
      "Take a breath and pull yourself upward by bending your elbows.",
      "Pull until your chin clears the bar, exhaling near the top.",
      "Lower yourself back down slowly by extending your elbows while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Pull Up (Assisted)",
    primaryMuscle: "Lats",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00171201-Assisted-Pull-up_Back.mp4",
    howToSteps: [
      "Select the appropriate assistance weight on the pull-up machine.",
      "Grab the pull-up bar with an overhand grip, palms facing forward.",
      "Place your knees on the padded platform.",
      "Pull your shoulders back, engage your core, and take a breath.",
      "Pull yourself upward until your chin is slightly above the bar, exhaling at the top.",
      "Lower yourself with control until your arms are fully extended while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Pull Up (Band)",
    primaryMuscle: "Lats",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Resistance Band",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/38441201-Band-Assisted-Pull-Up-(VERSION-3)-(female)_Back.mp4",
    howToSteps: [
      "Loop a resistance band securely around a pull-up bar and let it hang down.",
      "Place one foot at a time into the band and grab the bar with an overhand grip, hands slightly wider than shoulder-width.",
      "Hang from the bar, pull your shoulders back, and take a breath.",
      "Pull yourself upward until your chin clears the bar while exhaling.",
      "Pause briefly at the top, then slowly lower yourself back down, fully extending your arms while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Pull Up (Weighted)",
    primaryMuscle: "Lats",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/08411201-Weighted-Pull-Up_Back_.mp4",
    howToSteps: [
      "Attach a weight plate to your body using a weight belt.",
      "Reach up and grab the pull-up bar with an even overhand grip.",
      "Pull your shoulders back, engage your core, and take a breath.",
      "Pull yourself upward in one smooth motion, exhaling at the top.",
      "Lower yourself back down slowly with control while inhaling, keeping your feet off the floor.",
    ],
    isCustom: false,
  },

  {
    name: "Pullover (Dumbbell)",
    primaryMuscle: "Lats",
    secondaryMuscles: ["upper back", "triceps"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/03751201-Dumbbell-Pullover_Chest.mp4",
    howToSteps: [
      "Place a dumbbell on the floor next to a flat bench.",
      "Position your upper back across the bench with your hips lowered and feet flat on the floor.",
      "Reach down and grab the dumbbell, holding it securely with both hands on the top plate.",
      "Bring the dumbbell over your torso with your arms extended.",
      "Pull your shoulders back, engage your core, and inhale.",
      "Lower the dumbbell behind your head while keeping your arms straight.",
      "Pause briefly, then pull the dumbbell back to the starting position while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Pullover (Machine)",
    primaryMuscle: "Lats",
    secondaryMuscles: ["upper back", "triceps"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/22851201-Lever-Pullover-(plate-loaded)_Back_.mp4",
    howToSteps: [
      "Load the appropriate weight onto the machine and adjust the seat height.",
      "Sit down and place your lower triceps and elbows firmly on the pads, gripping the handles for stability.",
      "Take a breath, engage your core, and pull the weight down until your elbows are by your sides while exhaling.",
      "Slowly raise your arms back to the overhead starting position while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Push Press",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["triceps", "quadriceps"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/12001201-Push-Press_Shoulders.mp4",
    howToSteps: [
      "Hold the barbell in a front rack position with your hands just outside shoulder-width.",
      "Stand with your feet about hip-width apart and toes slightly pointed outward.",
      "Take a deep breath and dip a few inches by bending your knees and hips while keeping your torso upright.",
      "Quickly reverse the motion by driving through your heels to extend your knees and hips.",
      "Use the momentum from your lower body to drive the bar off your shoulders.",
      "Immediately press the bar overhead by extending your elbows, exhaling at the top.",
      "Lower the barbell back to the front rack position on your shoulders while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Push Up",
    primaryMuscle: "Chest",
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/06621201-Push-up-m_Chest.mp4",
    howToSteps: [
      "Start on all fours on the floor.",
      "Extend your body into a push-up position with hands flat on the floor, fingertips slightly turned out, and shoulder blades retracted.",
      "Straighten your legs so your body is supported on your toes, forming a straight line from ankles to shoulders.",
      "Take a breath and lower your body by bending your elbows.",
      "Lower as far as possible, ideally until your face is one to two inches from the floor.",
      "Pause briefly at the bottom, then press yourself back up while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Push Up (Weighted)",
    primaryMuscle: "Chest",
    secondaryMuscles: ["triceps", "shoulders"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/11721201-Assisted-Weighted-Push-up_Chest.mp4",
    howToSteps: [
      "Start on your knees and hands on the floor.",
      "Extend your legs back with your feet about hip-width apart.",
      "Place your hands slightly wider than shoulder-width and keep your elbows tucked.",
      "Engage your core to maintain a neutral spine.",
      "Have a partner carefully place a weight plate on your mid-back.",
      "Take a breath and lower your body by bending your elbows.",
      "Lower as far as your strength allows, ideally until your torso is a few inches from the floor.",
      "Press back up by extending your elbows while exhaling.",
      "Take another breath and repeat.",
    ],
    isCustom: false,
  },

  {
    name: "Push Up - Close Grip",
    primaryMuscle: "triceps",
    secondaryMuscles: ["chest", "shoulders"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02591201-Close-Grip-Push-up_Upper-Arms.mp4",
    howToSteps: [
      "Start on your hands and knees on the floor.",
      "Bring your hands close together under your chest.",
      "Extend your legs back into a push-up position, keeping your shoulders, hips, knees, and ankles aligned.",
      "Pull your shoulders back, engage your core, and take a breath.",
      "Lower your body by bending your elbows, keeping them close to your sides.",
      "Descend as far as possible, pause briefly at the bottom, then press back up while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Rack Pull",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["glutes", "hamstrings", "lower back", "lats"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00741201-Barbell-Rack-Pull_Hips_.mp4",
    howToSteps: [
      "Set the barbell on the rack at mid-shin height.",
      "Stand in front of the bar with your shins one to two inches away.",
      "Hinge forward and grip the bar with your hands just outside your thighs.",
      "Bring your shins to the bar and gently push your knees outward against your elbows.",
      "Lift your chest and arch your upper back to set your position.",
      "Drive your hips forward and engage your upper back to pull the bar up along your shins and thighs, exhaling at the top.",
      "Initiate the descent by pushing your hips back and lowering the bar in the same straight line while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Rear Delt Reverse Fly (Cable)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["upper back"],
    equipment: "Cable",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02251201-Cable-Standing-Cross-over-High-Reverse-Fly_Shoulders_.mp4",
    howToSteps: [
      "Set the pulleys of a dual cable machine to the highest position and attach handles.",
      "Select an appropriate weight and stand in the center of the machine.",
      "With your left shoulder facing a pulley, grab the handle with your right hand.",
      "Walk across to the opposite side and grab the other handle with your left hand.",
      "Stand centered, extend your arms in front of your body, and engage your core.",
      "Take a breath and pull your arms out to the sides, squeezing your upper back while exhaling.",
      "Slowly return your arms to the starting position while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Rear Delt Reverse Fly (Dumbbell)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["upper back"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/24871201-Dumbbell-Rear-Delt-Fly-(female)_Shoulders.mp4",
    howToSteps: [
      "Grab a pair of light dumbbells and stand with your feet hip-width apart.",
      "Hinge at the hips to lean your torso forward while maintaining a neutral spine.",
      "Extend your arms downward with your palms facing each other.",
      "Pull your shoulders back and take a breath.",
      "Raise the dumbbells out to the sides by engaging your rear delts.",
      "Lift until your elbows are in line with your shoulders, holding briefly while exhaling.",
      "Lower the dumbbells back to the starting position with control while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Rear Delt Reverse Fly (Machine)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["upper back"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/06021201-Lever-Seated-Reverse-Fly_Shoulders.mp4",
    howToSteps: [
      "Select the appropriate weight on the machine.",
      "Adjust the seat height so the handles align with your shoulders when seated.",
      "Sit down and grab the handles with your palms facing down.",
      "Pull your shoulders back and take a breath.",
      "Extend your arms out to the sides and slightly back while exhaling, squeezing your upper back.",
      "Return your arms to the starting position with control while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Rear Kick (Machine)",
    primaryMuscle: "Glutes",
    secondaryMuscles: ["hamstrings"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/99041201-Lever-Pure-Rear-Kick-(female)_Hips_.mp4",
    howToSteps: [
      "Load the appropriate weight and step inside the machine facing the chest pad and handles.",
      "Place one shin against the lower pad for stability and position the opposite foot flat against the footplate.",
      "Lean forward and press your chest and stomach against the pad while holding the handles.",
      "Inhale, brace your core, and push the platform back and upward in one smooth motion until your working leg is fully extended, exhaling at the top.",
      "Slowly bend your knee to return to the starting position while inhaling.",
      "Repeat for the desired number of reps, then switch legs and perform the same number on the other side.",
    ],
    isCustom: false,
  },

  {
    name: "Renegade Row (Dumbbell)",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["lats", "biceps", "forearms"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/29811201-Dumbbell-Renegade-Row-(female)_Back_.mp4",
    howToSteps: [
      "Place a pair of hex dumbbells on the floor, parallel to each other and spaced so you can grip them comfortably.",
      "Get into a high plank position by grabbing the dumbbells and extending your legs, keeping your body straight and chest lifted.",
      "Widen your feet slightly to improve balance.",
      "Shift your weight onto your left side.",
      "Take a breath and row the right dumbbell upward until your elbow is in line with your torso, exhaling at the top.",
      "Lower the dumbbell back to the floor with control while inhaling.",
      "Shift your weight to the right side and row the left dumbbell.",
      "Continue alternating sides until the set is complete.",
    ],
    isCustom: false,
  },

  {
    name: "Reverse Crunch",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/08721201-Reverse-Crunch-m_waist.mp4",
    howToSteps: [
      "Lie flat on the floor with your arms at your sides and hands pressed into the ground.",
      "Bend your knees to about 90 degrees and position them directly above your hips.",
      "Take a breath, engage your core, and curl your knees toward your upper torso, lifting your hips off the floor while exhaling.",
      "Lower your hips back down with control and return your knees to the starting position while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Reverse Curl (Barbell)",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["forearms"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00801201-Barbell-Reverse-Curl_Forearm.mp4",
    howToSteps: [
      "Grab a barbell with an overhand grip, palms facing your body.",
      "Stand tall with your feet in a comfortable stance and retract your shoulder blades.",
      "Engage your core and take a breath.",
      "Curl the barbell upward by bending your elbows until your wrists are slightly higher than your elbows, exhaling at the top.",
      "Lower the barbell back down under control while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Reverse Curl (Cable)",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["forearms"],
    equipment: "Cable",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02061201-Cable-Reverse-Curl_Forearm.mp4",
    howToSteps: [
      "Set the cable pulley to the lowest position, attach a straight bar, and select an appropriate weight.",
      "Lean forward slightly, grab the bar with an overhand grip, and stand up.",
      "Take a step back to lift the weight off the stack.",
      "Retract your shoulder blades, engage your core, and stabilize your stance.",
      "Curl the bar upward in one smooth motion until your wrists are slightly higher than your elbows, keeping your elbows close to your sides while exhaling.",
      "Lower the bar back down with control while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Reverse Curl (Dumbbell)",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["forearms"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/03821201-Dumbbell-Revers-grip-Biceps-Curl_Forearms.mp4",
    howToSteps: [
      "Grab a pair of dumbbells and stand tall.",
      "Hold the dumbbells in front of your thighs with your palms facing your body.",
      "Retract your shoulder blades, engage your core, and take a breath.",
      "Curl the dumbbells upward until your wrists are slightly higher than your elbows while exhaling.",
      "Lower the dumbbells back down under control while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Reverse Grip Concentration Curl",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["forearms"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/04031201-Dumbbell-Seated-Revers-grip-Concentration-Curl_Forearms_.mp4",
    howToSteps: [
      "Grab a dumbbell and sit on the edge of a flat bench.",
      "Spread your legs with your feet flat on the floor.",
      "Hold the dumbbell with a pronated grip, palm facing inward.",
      "Rest your working elbow against the inside of your thigh.",
      "Take a breath and curl the dumbbell upward by bending your arm.",
      "Lift until your wrist is slightly higher than your elbow while exhaling.",
      "Lower the dumbbell back down under control while inhaling.",
      "Switch arms and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Reverse Grip Lat Pulldown (Cable)",
    primaryMuscle: "Lats",
    secondaryMuscles: ["upper back", "biceps"],
    equipment: "Cable",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02081201-Cable-Reverse-grip-Straight-Back-Seated-High-Row_Back.mp4",
    howToSteps: [
      "Select the appropriate weight on the cable machine.",
      "Adjust the thigh pad so your legs are secured snugly underneath.",
      "Stand tall and grab the bar with an even underhand grip, palms facing toward you.",
      "Sit down, pull your shoulders back, and engage your core.",
      "Take a breath and pull the bar down toward your chest, exhaling as you pull.",
      "Slowly extend your arms back to the starting position while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Reverse Hyperextension",
    primaryMuscle: "Glutes",
    secondaryMuscles: ["hamstrings", "lower back"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05931201-Lever-Reverse-Hyperextension-(plate-loaded)_Hips.mp4",
    howToSteps: [
      "Load the appropriate weight onto the reverse hyperextension machine.",
      "Adjust the foot pads so they rest securely against your Achilles heels when positioned on the machine.",
      "Lie face down on the machine with your hips at the edge of the pad and grip the handles for support.",
      "Secure your feet between the lower pads.",
      "Pull your shoulders back and take a breath.",
      "Lift your legs upward in one smooth motion until your body forms a straight line, exhaling at the top.",
      "Lower your legs back to the starting position with control while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Reverse Lunge",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/63881201-Bodyweight-Reverse-Lunge-(female)_Thighs_.mp4",
    howToSteps: [
      "Stand tall with your shoulders back, core engaged, and hands on your hips.",
      "Set your feet in a comfortable stance with toes slightly pointed outward.",
      "Take a breath and step your right leg back, landing on the ball of your foot.",
      "Lower into a lunge by bending your front knee, keeping your front shin mostly vertical.",
      "Descend until your front thigh is nearly parallel to the floor and your back knee is just above the ground.",
      "Pause briefly at the bottom, then press through your front heel to return to standing while exhaling.",
      "Bring your right foot back to the starting position.",
      "Step back with your left leg and continue alternating sides.",
    ],
    isCustom: false,
  },

  {
    name: "Reverse Lunge (Barbell)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/22261201-Barbell-Rear-Lunge-(female)_Thighs_.mp4",
    howToSteps: [
      "Place a barbell across your upper back and grip it securely with both hands.",
      "Stand tall with your shoulders back, core engaged, and feet in a comfortable stance.",
      "Take a breath and step your right leg back, landing on the ball of your foot.",
      "Lower into a controlled lunge by bending your front knee, keeping your front shin mostly vertical.",
      "Descend until your front thigh is nearly parallel to the floor and your rear knee is just above the ground.",
      "Pause briefly at the bottom, then press through your front heel to return to standing while exhaling.",
      "Bring your right foot back to the starting position.",
      "Step back with your left leg and repeat, alternating sides for the set.",
    ],
    isCustom: false,
  },

  {
    name: "Reverse Lunge (Dumbbell)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/03811201-Dumbbell-Rear-Lunge_Thighs.mp4",
    howToSteps: [
      "Grab a pair of dumbbells and stand tall.",
      "Position your feet in a comfortable stance, pull your shoulders back, and engage your core.",
      "Take a breath and step your right leg back, landing on the ball of your foot, and immediately lower into a lunge by bending your front knee.",
      "Descend until your front thigh is nearly parallel to the floor and your rear knee is just above the ground, keeping your front shin relatively vertical.",
      "Pause briefly at the bottom, then press through your front heel to return to standing while exhaling.",
      "Bring your right foot back to the starting position.",
      "Step back with your left leg and repeat, alternating sides for the set.",
    ],
    isCustom: false,
  },

  {
    name: "Reverse Plank",
    primaryMuscle: "Abdominals",
    secondaryMuscles: ["triceps"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/08671201-Reverse-plank_Back.mp4",
    howToSteps: [
      "Sit on the floor with your legs extended and feet together.",
      "Place your hands behind you with palms flat on the floor and elbows straight.",
      "Engage your glutes and lift your hips toward the ceiling while raising your torso.",
      "Align your head, neck, torso, and legs in a straight line, keeping your arms straight and looking upward.",
      "Maintain tension in your core and glutes, breathe steadily, and hold the position.",
      "Lower your hips back to the floor and rest when finished.",
    ],
    isCustom: false,
  },

  {
    name: "Ring Dips",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/06771201-Ring-Dip_Upper-Arms_.mp4",
    howToSteps: [
      "Adjust the rings so they are roughly at stomach height.",
      "Stand between the rings and grip them firmly with both hands.",
      "Keep your arms straight and elbows close to your torso.",
      "Pull your shoulders back, engage your core, and squeeze your glutes.",
      "Lift your feet off the floor one at a time to stabilize your body.",
      "Once stable, take a breath and bend your arms to lower yourself.",
      "Descend gradually until your elbows are moderately bent and you feel a stretch in your chest.",
      "Press through your triceps to return to the starting position while exhaling, maintaining controlled movements to avoid instability.",
    ],
    isCustom: false,
  },

  {
    name: "Ring Pull Up",
    primaryMuscle: "Lats",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/55221201-Ring-Pull-Up_Back_.mp4",
    howToSteps: [
      "Secure a pair of rings at pull-up bar height.",
      "Grab the rings with an overhand grip, palms facing forward.",
      "Pull your shoulders back and down, and engage your core.",
      "Bend your knees or position your feet slightly forward to suspend your body.",
      "Inhale and pull yourself upward in one smooth motion, exhaling at the top.",
      "Slowly lower yourself back down by extending your arms while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Ring Push Up",
    primaryMuscle: "Chest",
    secondaryMuscles: ["shoulders", "triceps"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/08061201-Suspended-Push-Up_Chest_.mp4",
    howToSteps: [
      "Secure a pair of rings just an inch or two above the ground.",
      "Kneel down and grab the rings firmly.",
      "Pull your shoulders back and engage your chest, triceps, and core for stability.",
      "Extend your legs back to assume a push-up position, supporting your body on your toes.",
      "Tighten your glutes for additional stability.",
      "Inhale and slowly lower your body while keeping your elbows close to your torso.",
      "Lower as far as your strength allows, then press back up while exhaling.",
      "Inhale and repeat for the desired number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Romanian Deadlift (Barbell)",
    primaryMuscle: "Hamstrings",
    secondaryMuscles: ["glutes", "lower back", "upper back", "lats"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00851201-Barbell-Romanian-Deadlift_Hips-FIX_.mp4",
    howToSteps: [
      "Grab a barbell with a double overhand grip, hands shoulder-width apart.",
      "Stand tall with shoulders retracted, core engaged, and feet in a comfortable stance.",
      "Take a breath and hinge at the hips, pushing your buttocks back while keeping a neutral spine.",
      "Lower the bar in a straight line, keeping it close to your body and feeling a stretch in your hamstrings.",
      "Drive your hips forward to return to standing, exhaling near the top.",
    ],
    isCustom: false,
  },

  {
    name: "Romanian Deadlift (Dumbbell)",
    primaryMuscle: "Hamstrings",
    secondaryMuscles: ["glutes", "lower back", "upper back", "lats"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/14591201-Dumbbell-Romanian-Deadlift_Hips.mp4",
    howToSteps: [
      "Grab a pair of dumbbells and stand tall.",
      "Hold the dumbbells in front of your hips with your palms facing your body.",
      "Pull your shoulders back, set your feet a few inches apart, and take a breath.",
      "Hinge at your hips, leaning your torso forward while maintaining a neutral spine, feeling a stretch in your hamstrings.",
      "Lower the dumbbells in a straight line until they reach below knee level.",
      "Drive your hips forward to return to standing, exhaling at the top.",
    ],
    isCustom: false,
  },

  {
    name: "Rope Cable Curl",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["forearms"],
    equipment: "Cable",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/01651201-Cable-Hammer-Curl-(with-rope)-(male)_Forearms_.mp4",
    howToSteps: [
      "Set the cable pulley to the lowest position and attach a rope handle.",
      "Select an appropriate weight on the machine.",
      "Bend forward slightly and grab both ends of the rope with a neutral grip (palms facing each other).",
      "Stand tall, retract your shoulders, and step back to lift the weight off the stack.",
      "Take a breath and curl the rope by bending your elbows.",
      "Raise until your wrists are slightly higher than your elbows, exhaling at the top.",
      "Slowly extend your arms back to the starting position while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Rope Straight Arm Pulldown",
    primaryMuscle: "Lats",
    secondaryMuscles: ["triceps"],
    equipment: "Cable",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02371201-Cable-Straight-Arm-Pulldown-(with-rope)_Back.mp4",
    howToSteps: [
      "Select an appropriate weight on the cable machine.",
      "Set the pulley to the highest position and attach a rope handle.",
      "Grab both ends of the rope with a neutral grip (palms facing each other) and fully extend your arms.",
      "Step back, engage your core, and retract your shoulders.",
      "Take a breath and pull the rope down toward your hips while keeping your arms straight, exhaling as you pull.",
      "Slowly return the rope to the starting position while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Rowing Machine",
    primaryMuscle: "Cardio",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/22701201-Rowing-Straight-Back-(with-rowing-machine)-(female)_Cardio.mp4",
    howToSteps: [
      "Select the appropriate resistance and sit down on the rowing machine.",
      "Reach forward and grab the handle or cable attachment.",
      "Place your feet flat on the footplates and bend your knees slightly.",
      "With arms extended, inhale and push yourself backward by engaging your legs.",
      "As you move back, pull the handle toward your torso while exhaling.",
      "Simultaneously extend your arms and bend your knees to return to the starting position while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Running",
    primaryMuscle: "Cardio",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/21961201-Run-(female)_Cardio.mp4",
    howToSteps: [
      "Stand tall with your shoulders back and core engaged.",
      "Move forward, aiming for a midfoot strike—landing on the middle of your foot.",
      "Keep your arms bent and hands relaxed.",
      "Swing your arms naturally in sync with your legs.",
      "Land lightly on your feet, avoiding unnecessary vertical bounce.",
      "Maintain an upright torso, keep your gaze a few feet ahead, and engage your core.",
      "Breathe steadily, inhaling through your nose and exhaling through your mouth.",
    ],
    isCustom: false,
  },

  {
    name: "Russian Twist (Bodyweight)",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/06871201-Russian-Twist_waist.mp4",
    howToSteps: [
      "Sit on the floor with your knees bent and feet flat.",
      "Bring your arms in front of your torso and lean back slightly, engaging your core.",
      "Take a breath and twist your torso to the right, holding briefly while exhaling.",
      "Return to the center while inhaling.",
      "Twist to the left and exhale.",
      "Continue alternating sides for the desired number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Russian Twist (Weighted)",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/23711201-Weighted-Russian-Twist_Waist.mp4",
    howToSteps: [
      "Grab a weight plate or dumbbell and sit on the floor.",
      "Bend your knees and plant your feet flat on the ground. Optionally, secure your feet under a bench or have a partner hold them.",
      "Hold the weight in front of your torso with arms extended.",
      "Lean your torso slightly back and engage your core.",
      "Take a breath and twist the weight to the right, exhaling as you rotate your torso.",
      "Return to the starting position while inhaling.",
      "Twist the weight to the left and exhale.",
      "Continue alternating sides for the desired number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Scapular Pull Ups",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["lats", "forearms"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/06881201-Scapular-Pull-Up_Back_.mp4",
    howToSteps: [
      "Grab a pull-up bar with an even overhand grip (palms facing forward).",
      "Engage your abs and lift your feet off the floor to suspend yourself in the air.",
      "Keep your abs and glutes engaged to remain still and avoid swinging.",
      "Initiate the movement by pulling your shoulders back and down while keeping your arms straight.",
      "Hold the retracted position for one to two seconds while breathing out.",
      "Relax and allow your shoulders to move forward and up as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Seated Cable Row - Bar Grip",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["lats", "biceps", "forearms"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/01801201-Cable-Low-Seated-Row_Back.mp4",
    howToSteps: [
      "Select an appropriate load and sit down on the machine.",
      "Reach forward and grab the bar evenly with both hands.",
      "Sit back and place your feet firmly on the footplates.",
      "Bring your shoulders back and engage your abs.",
      "Pull the handle toward your upper stomach while breathing out.",
      "Pause briefly, then extend your arms fully as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Seated Cable Row - Bar Wide Grip",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["lats", "upper back", "biceps", "forearms"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02181201-Cable-Seated-Wide-grip-Row_Back.mp4",
    howToSteps: [
      "Attach a curved bar to a seated cable row machine.",
      "Select an appropriate weight on the stack.",
      "Sit down, place your feet on the platform, and slightly bend your knees.",
      "Lean forward and grab the bar with a double overhand grip (palms facing down).",
      "Lean back to lift the weight, engage your abs, and retract your shoulder blades.",
      "Row the bar toward your stomach while squeezing your back and breathing out.",
      "Slowly extend your arms and breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Seated Cable Row - V Grip (Cable)",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["lats", "biceps", "forearms"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/26611201-Cable-Seated-Row-with-V-bar_Back.mp4",
    howToSteps: [
      "Attach a V-handle to a seated cable row machine and select an appropriate weight.",
      "Sit down and grab the handle with both hands.",
      "Place your feet on the platform, sit back, and maintain a slight bend in your knees.",
      "Retract your shoulder blades and engage your abs while keeping your torso upright.",
      "Pull the handle toward your stomach in one smooth motion, pausing briefly and breathing out.",
      "Slowly extend your arms as you breathe in.",
    ],
    isCustom: false,
  },
  {
    name: "Seated Calf Raise",
    primaryMuscle: "Calves",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05941201-Lever-Seated-Calf-Raise-(plate-loaded).mp4",
    howToSteps: [
      "Load the machine, sit down, and adjust the pad so your thighs fit snugly.",
      "Position your thighs against the pad and firmly grab the handles.",
      "Unrack the weight by extending your ankles and engaging your calves.",
      "Move the safety bar aside and slowly lower the weight until you feel a stretch in your calves.",
      "Press through the balls of your feet to raise the weight, flexing your calves and exhaling near the top.",
    ],
    isCustom: false,
  },

  {
    name: "Seated Chest Flys (Cable)",
    primaryMuscle: "Chest",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/38691201-Cable-Seated-Chest-Fly_Chest_.mp4",
    howToSteps: [
      "Select the same weight on both stacks of a double cable machine.",
      "Set both pulleys at the same height, roughly at stomach level.",
      "Attach handles to both pulleys and place an upright bench facing away from the machine.",
      "Grab the handles one at a time, walk to the bench, and sit down.",
      "Extend your arms in front of your body, retract your shoulder blades, inhale, and brace your abs.",
      "Slowly open your arms to your sides until you feel a stretch in your chest.",
      "Bring your hands back together while squeezing your chest and breathing out.",
    ],
    isCustom: false,
  },

  {
    name: "Seated Dip Machine",
    primaryMuscle: "Triceps",
    secondaryMuscles: ["shoulders"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/14511201-Lever-Seated-Dip_Upper-Arms.mp4",
    howToSteps: [
      "Select an appropriate load on the machine.",
      "Sit down and grab the handles positioned at your sides.",
      "Plant your feet on the floor, bring your shoulders back, and engage your abs.",
      "Press the handles down while fully extending your arms and breathing out.",
      "Slowly bend your arms to return to the starting position as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Seated Incline Curl (Dumbbell)",
    primaryMuscle: "Biceps",
    secondaryMuscles: [],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/03151201-Dumbbell-Incline-Biceps-Curl_Upper-Arms.mp4",
    howToSteps: [
      "Adjust a bench to an incline of approximately 65 to 75 degrees.",
      "Grab a pair of dumbbells and sit back on the bench.",
      "Let your arms hang at your sides with your palms facing each other.",
      "Bring your shoulders back, engage your abs, and take a breath.",
      "Curl the dumbbells upward while rotating your wrists outward, exhaling as you lift.",
      "Lower the dumbbells slowly back to the starting position while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Seated Lateral Raise (Dumbbell)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: [],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/03961201-Dumbbell-Seated-Lateral-Raise_shoulder.mp4",
    howToSteps: [
      "Grab a pair of light dumbbells and sit at the edge of a flat bench.",
      "Hold a dumbbell in each hand with your arms at your sides and palms facing your body.",
      "Bring your shoulders back and engage your abs.",
      "Raise the dumbbells out to your sides until they reach shoulder height while breathing out.",
      "Lower the dumbbells slowly back to your sides as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Seated Leg Curl (Machine)",
    primaryMuscle: "Hamstrings",
    secondaryMuscles: ["calves"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05991201-Lever-Seated-Leg-Curl_Thighs.mp4",
    howToSteps: [
      "Select an appropriate load on the machine.",
      "Adjust the pad so it rests against your Achilles heels when seated.",
      "Sit down, position the back of your lower legs against the pad, and grab the side handles.",
      "Bring your shoulders back, engage your abs, and inhale.",
      "Curl the pad down by bending your knees and contracting your hamstrings while breathing out.",
      "Pause briefly, then slowly extend your knees back to the starting position as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Seated Overhead Press (Barbell)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["triceps"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/68771201-Barbell-Incline-Shoulders-Press-(inside-squat-cage.mp4",
    howToSteps: [
      "Position an upright bench inside a squat rack.",
      "Set the barbell on the rack at a height you can unrack while seated with slightly bent arms.",
      "Sit down on the bench and plant your feet firmly on the floor.",
      "Grab the barbell with an even overhand grip at about shoulder width.",
      "Engage your abs, take a breath, and carefully unrack the bar.",
      "Lower the bar to your upper chest while leaning back into the bench.",
      "Press the barbell overhead while exhaling at the top.",
      "Lower the bar to collarbone level as you breathe in, keeping your elbows slightly below shoulder height.",
      "Press the bar upward again for the next repetition.",
      "Once finished, carefully rack the barbell.",
    ],
    isCustom: false,
  },

  {
    name: "Seated Overhead Press (Dumbbell)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["triceps"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02901201-Dumbbell-Bench-Seated-Press_Shoulders.mp4",
    howToSteps: [
      "Grab a pair of dumbbells and sit on a flat bench or plyo box.",
      "Rest the dumbbells on your thighs, bring your shoulders back, and engage your abs.",
      "Use your legs to help thrust the dumbbells up into position at shoulder height.",
      "Press the dumbbells overhead while exhaling at the top.",
      "Lower the dumbbells slowly until your elbows are slightly below shoulder level as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Seated Palms Up Wrist Curl",
    primaryMuscle: "Forearms",
    secondaryMuscles: [],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/26331201-Dumbbell-Seated-Palms-Up-Wrist-Curl-(female)_Forea.mp4",
    howToSteps: [
      "Grab a pair of light dumbbells and sit on a flat bench.",
      "Rest your forearms on your thighs with your wrists just past your knees.",
      "Lower the dumbbells by extending your wrists while breathing in.",
      "Curl the dumbbells upward by flexing your forearms, holding briefly at the top and breathing out.",
    ],
    isCustom: false,
  },

  {
    name: "Seated Row (Machine)",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["lats", "biceps", "forearms"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/22651201-Lever-Seated-Row-(version-2)_Back.mp4",
    howToSteps: [
      "Select an appropriate load on the machine.",
      "Sit down and grab the handles with a neutral grip, palms facing each other.",
      "Bring your shoulders back and engage your abs.",
      "Pull the handles toward your torso in one smooth motion while breathing out.",
      "Squeeze your back muscles briefly at the end of the pull.",
      "Slowly extend your arms back to the starting position as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Seated Shoulder Press (Machine)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["triceps"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/14541201-Lever-Seated-Shoulder-Press_Shoulders.mp4",
    howToSteps: [
      "Select an appropriate load on the machine.",
      "Sit down and press your shoulder blades firmly into the back support.",
      "Plant your feet flat on the floor for stability.",
      "Grab the handles at your sides with your palms facing forward.",
      "Engage your abs and take a breath.",
      "Press the weight straight up until your arms are fully extended while breathing out.",
      "Lower the weight back to the starting position as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Seated Triceps Press",
    primaryMuscle: "Triceps",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/18711201-Lever-Triceps-Dip-(plate-loaded)_Upper-Arms-FIX_.mp4",
    howToSteps: [
      "Select an appropriate weight on the machine and sit down.",
      "Grab the handles at your sides with a comfortable grip.",
      "Bring your shoulders back, engage your abs, and take a breath.",
      "Press the handles down until your elbows are fully extended while breathing out.",
      "Slowly bend your arms to return to the starting position as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Seated Wrist Extension (Barbell)",
    primaryMuscle: "Forearms",
    secondaryMuscles: [],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00791201-Barbell-Revers-Wrist-Curl-II_Forearms.mp4",
    howToSteps: [
      "Grab a loaded barbell with an overhand grip, palms facing your body.",
      "Sit on the edge of a flat bench and plant your feet firmly on the floor.",
      "Rest your forearms on your thighs with your wrists positioned just past your knees.",
      "Lower the barbell by flexing your wrists while breathing in.",
      "Raise the barbell by extending your wrists and breathing out.",
    ],
    isCustom: false,
  },

  {
    name: "Shoulder Press (Dumbbell)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["triceps"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/04051201-Dumbbell-Seated-Shoulder-Press_Shoulders.mp4",
    howToSteps: [
      "Set an adjustable bench to a near-upright position.",
      "Grab a pair of dumbbells and sit down on the bench.",
      "Rest the dumbbells on top of your thighs.",
      "Bring your shoulders back, engage your abs, and take a breath.",
      "Use your thighs to help kick the dumbbells up into position.",
      "Hold the dumbbells at shoulder level with your palms facing forward.",
      "Press the dumbbells upward and slightly inward, tapping them together at the top as you breathe out.",
      "Lower the dumbbells until your elbows are slightly below shoulder height while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Shoulder Press (Machine Plates)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["triceps"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05871201-Lever-Military-Press-(plate-loaded)_shoulder.mp4",
    howToSteps: [
      "Load the machine with equal weight on both sides.",
      "Adjust the seat height so your elbows are slightly below shoulder level when gripping the handles.",
      "Sit down and grab the handles firmly.",
      "Lean back into the support and retract your shoulder blades.",
      "Engage your abs and take a deep breath.",
      "Press the weight upward in one smooth motion while breathing out at the top.",
      "Lower the weight slowly back to the starting position as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Shoulder Taps",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["triceps"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/06991201-Shoulder-Tap-Push-up_Plyometrics.mp4",
    howToSteps: [
      "Start on your hands and knees on the floor.",
      "Extend your legs back and balance your body on your toes.",
      "Place your hands flat on the floor at about shoulder-width apart.",
      "Engage your abs to keep your body straight and retract your shoulder blades.",
      "Lower your body by bending your elbows, then press back up through your palms.",
      "Lift your left hand and tap your right shoulder while breathing out.",
      "Place your hand back on the floor and perform another push-up while breathing in.",
      "Lift your right hand to tap your left shoulder.",
      "Continue alternating sides while maintaining a stable core.",
    ],
    isCustom: false,
  },

  {
    name: "Shrug (Barbell)",
    primaryMuscle: "Upper Back",
    secondaryMuscles: [],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00951201-Barbell-Shrug_Back.mp4",
    howToSteps: [
      "Grab a barbell with an overhand grip, hands just outside your thighs.",
      "Stand tall with your arms straight, engage your abs, and set your posture.",
      "Elevate your shoulders straight upward as if trying to touch your ears, breathing out at the top.",
      "Lower your shoulders back down under control while breathing in.",
    ],
    isCustom: false,
  },

  {
    name: "Shrug (Cable)",
    primaryMuscle: "Upper Back",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02201201-Cable-Shrug_Back.mp4",
    howToSteps: [
      "Set the pulley to the lowest position and attach a straight bar.",
      "Select an appropriate weight on the stack.",
      "Grab the bar with an overhand grip and stand up to lift the weight.",
      "Step back slightly, bring your shoulders back, and engage your abs and glutes.",
      "Elevate your shoulders straight upward while breathing out at the top.",
      "Lower your shoulders back down slowly as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Shrug (Dumbbell)",
    primaryMuscle: "Upper Back",
    secondaryMuscles: [],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/04061201-Dumbbell-Shrug_Back.mp4",
    howToSteps: [
      "Grab a pair of dumbbells and stand tall with your arms at your sides and wrists neutral.",
      "Bring your shoulders back and engage your abs.",
      "Elevate your shoulders straight upward as high as possible while keeping your arms straight.",
      "Squeeze at the top briefly while breathing out.",
      "Lower your shoulders back to the starting position under control as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Shrug (Machine)",
    primaryMuscle: "Upper Back",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/06041201-Lever-Shrug-(plate-loaded)_Back.mp4",
    howToSteps: [
      "Load the machine with an appropriate amount of weight.",
      "Stand between the handles, grab them firmly, and stand tall.",
      "Keep your arms straight at your sides, engage your abs, and take a deep breath.",
      "Elevate your shoulders upward in one smooth motion while breathing out.",
      "Lower your shoulders back to the starting position under control as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Shrug (Smith Machine)",
    primaryMuscle: "Upper Back",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/07461201-Smith-Back-Shrug_Back.mp4",
    howToSteps: [
      "Set the Smith machine bar at hip height and load the desired weight.",
      "Face away from the bar and grab it with an overhand grip, palms facing back.",
      "Engage your abs and take a breath.",
      "Rotate the bar to unrack it from the Smith machine.",
      "Elevate your shoulders as high as possible, squeezing your upper back at the top while breathing out.",
      "Lower your shoulders back down under control as you breathe in.",
      "Once finished, rotate the bar to rack it safely on the Smith machine.",
    ],
    isCustom: false,
  },

  {
    name: "Side Bend",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00021201-45-Side-Bend_Waist.mp4",
    howToSteps: [
      "Stand sideways on a back hyperextension machine with your upper thigh against the pad and feet secured.",
      "Place your hands behind your head and engage your abs.",
      "Bend your torso to the side in a controlled motion while breathing out.",
      "Return to the starting position as you breathe in, then repeat on the opposite side.",
    ],
    isCustom: false,
  },

  {
    name: "Side Bend (Dumbbell)",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/04071201-Dumbbell-Side-Bend_Waist.mp4",
    howToSteps: [
      "Hold a dumbbell in one hand and stand tall with the weight at your side.",
      "Place your free hand behind your head and engage your abs.",
      "Bend your torso to the opposite side in a controlled motion while breathing out.",
      "Return to the upright position as you breathe in.",
      "Repeat for the desired number of repetitions, then switch sides.",
    ],
    isCustom: false,
  },

  {
    name: "Side Plank",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/07151201-Side-Plank-m_Waist.mp4",
    howToSteps: [
      "Lie on your side with your forearm on the floor directly under your shoulder.",
      "Stack your legs with one foot on top of the other.",
      "Engage your core and lift your hips off the floor to form a straight line.",
      "Hold the position for 30 to 60 seconds while breathing steadily.",
      "Lower your hips, switch sides, and repeat.",
    ],
    isCustom: false,
  },

  {
    name: "Single Arm Cable Crossover",
    primaryMuscle: "Chest",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/62191201-Cable-Standing-Single-Arm-Fly_Chest_.mp4",
    howToSteps: [
      "Set the pulley to chest height and attach a single handle.",
      "Select an appropriate load on the machine.",
      "Grab the handle, step away from the machine, and turn your side toward it so the pulley is slightly behind you.",
      "Bring your shoulders back, engage your abs, and take a breath.",
      "With a slight bend in your arm, pull the handle across your body in front of your torso while squeezing your chest and breathing out.",
      "Slowly return your arm back to the side as you breathe in.",
      "Switch arms and repeat the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Single Arm Cable Row",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["lats", "biceps", "forearms"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/75641201-Cable-Split-Stance-Single-Arm-Row-(male)_Back_.mp4",
    howToSteps: [
      "Set a cable pulley to a low or chest-height position and attach a single handle.",
      "Select an appropriate load, grab the handle, and step back to lift the weight from the stack.",
      "Bring your shoulders back, stagger your stance, slightly bend your knees, engage your abs, and inhale.",
      "Pull the handle toward your side, keeping your elbow close to your torso while squeezing your back and breathing out.",
      "Pause briefly at the top, then slowly extend your arm back to the starting position as you breathe in.",
      "Switch arms and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Single Arm Curl (Cable)",
    primaryMuscle: "Biceps",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/01901201-Cable-One-Arm-Curl_Upper-Arms.mp4",
    howToSteps: [
      "Set the pulley to the lowest position, attach a handle, and select an appropriate weight.",
      "Grab the handle with one hand using an underhand grip, palm facing up.",
      "Step back slightly, engage your abs, and take a breath.",
      "Curl the handle upward while squeezing your biceps and breathing out.",
      "Lower the handle slowly back to the starting position as you breathe in.",
      "Switch arms and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Single Arm Landmine Press (Barbell)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["triceps"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/50941201-Landmine-Single-Arm-Press_Shoulders_.mp4",
    howToSteps: [
      "Anchor one end of a barbell into a landmine attachment.",
      "Load weight plates onto the free end of the barbell.",
      "Grab the loaded end with both hands and lift the bar to chest height.",
      "Stand tall, bring your shoulders back, engage your abs, and release one hand.",
      "Press the bar forward and upward with one arm until it is fully extended while breathing out.",
      "Lower the bar back toward your upper chest under control as you breathe in.",
      "Switch arms and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Single Arm Lat Pulldown",
    primaryMuscle: "Lats",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/12041201-Cable-one-arm-lat-pulldown_back.mp4",
    howToSteps: [
      "Select an appropriate weight and attach a single handle to the pulley.",
      "Adjust the knee pad so your thighs fit snugly underneath.",
      "Stand tall and grab the handle with one hand.",
      "Sit down and secure your thighs under the pad.",
      "With your arm straight, retract your shoulder blades, engage your abs, and inhale.",
      "Pull the handle down and slightly inward while keeping your elbow close to your torso and breathing out.",
      "Pause briefly at the bottom to squeeze your back.",
      "Slowly extend your arm back to the starting position as you breathe in.",
      "Switch arms and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Single Arm Lateral Raise (Cable)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/01921201-Cable-One-Arm-Lateral-Raise_Shoulders.mp4",
    howToSteps: [
      "Set the pulley to the lowest position, attach a handle, and select an appropriate weight.",
      "Stand sideways to the machine and grab the handle with the arm farthest from the pulley.",
      "Step laterally away from the machine to lift the weight and keep a slight bend in your arm.",
      "Raise your arm out to the side until your wrist and elbow align with your shoulder while breathing out.",
      "Lower your arm slowly back to the starting position as you breathe in.",
      "Switch sides and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Single Arm Tricep Extension (Dumbbell)",
    primaryMuscle: "Triceps",
    secondaryMuscles: [],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/03621201-Dumbbell-One-Arm-Triceps-Extension-(on-bench)_Upper-Arms.mp4",
    howToSteps: [
      "Hold a dumbbell in one hand and sit on a flat bench or chair.",
      "Lift the dumbbell overhead and fully extend your arm.",
      "Bring your shoulders back, engage your abs, and inhale.",
      "Lower the dumbbell behind your head while keeping your elbow fixed in place.",
      "Extend your elbow to raise the dumbbell back overhead while breathing out.",
      "Switch arms and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Single Arm Triceps Pushdown (Cable)",
    primaryMuscle: "Triceps",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/50331201-Cable-Single-Arm-Triceps-Pushdown-(rope-attachment.mp4",
    howToSteps: [
      "Set the pulley to the highest position, attach a rope, and select an appropriate weight.",
      "Grab the rope with one hand, keep your elbow pinned to your side, and step back slightly.",
      "Hold the machine column with your free hand, engage your abs, and take a breath.",
      "Extend your arm downward by contracting your triceps while breathing out.",
      "Slowly bend your arm to return to the starting position as you breathe in.",
      "Switch arms and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Single Leg Extensions",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/71081201-Lever-Seated-Leg-Extension-(VERSION-2)_Thighs_.mp4",
    howToSteps: [
      "Select an appropriate load on the leg extension machine.",
      "Adjust the pad so it rests just above your feet when seated.",
      "Set the back support so your knees align just in front of the seat edge.",
      "Sit down, place one leg against the pad, grab the side handles, bring your shoulders back, and inhale.",
      "Extend your leg fully by contracting your quadriceps while breathing out.",
      "Lower the weight back down under control as you breathe in.",
      "Switch legs and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Single Leg Glute Bridge",
    primaryMuscle: "Glutes",
    secondaryMuscles: ["hamstrings", "quadriceps"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/60001201-Single-Leg-Bridge-with-Outstretched-Leg-(left)-(ma.mp4",
    howToSteps: [
      "Lie on an exercise mat with your arms at your sides and hands flat on the floor.",
      "Bend your knees and place your feet flat on the floor.",
      "Lift one leg off the ground and keep it extended.",
      "Press through the heel of the planted foot to drive your hips upward while inhaling.",
      "Extend your hips until they align with your knees and shoulders, squeezing your glutes and breathing out at the top.",
      "Lower your hips back to the floor under control as you breathe in.",
      "Switch legs and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Single Leg Hip Thrust",
    primaryMuscle: "Glutes",
    secondaryMuscles: ["hamstrings", "quadriceps"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/20711201-Single-Leg_Hip-Thrusts_Hips_.mp4",
    howToSteps: [
      "Sit on the floor with your upper back against a flat bench.",
      "Place your arms on the bench at your sides for support.",
      "Bend your knees and place your feet flat on the floor.",
      "Lift one foot off the ground, engage your abs, and take a breath.",
      "Drive through the planted foot to extend your hips until your torso is in line with your thighs while breathing out.",
      "Lower your hips back toward the floor under control as you breathe in.",
      "Switch legs and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Single Leg Hip Thrust (Dumbbell)",
    primaryMuscle: "Glutes",
    secondaryMuscles: ["hamstrings", "quadriceps"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/80751201-Dumbbell-Single-Leg-Hip-Thrust_Hips_.mp4",
    howToSteps: [
      "Place a dumbbell next to a flat bench.",
      "Sit on the floor with your upper back against the edge of the bench, grab the dumbbell, and position it across your hips.",
      "Bend one knee and plant that foot on the floor while extending the opposite leg.",
      "Engage your abs, take a deep breath, and press through the planted heel to drive your hips upward.",
      "Pause briefly at the top while squeezing your glutes and breathing out.",
      "Lower your hips back to the floor under control as you breathe in.",
      "Switch legs and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Single Leg Press (Machine)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/08831201-Lever-Horizontal-One-leg-Press_Hips.mp4",
    howToSteps: [
      "Set an appropriate load on the leg press machine and sit down.",
      "Place one foot flat on the platform and grab the side handles, keeping your other foot off the platform.",
      "Engage your abs and take a breath.",
      "Extend your working leg to unrack the safety.",
      "Lower the platform by bending your knee under control while breathing in.",
      "Press through your heel to extend your leg and breathe out.",
      "Switch legs and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Single Leg Romanian Deadlift (Barbell)",
    primaryMuscle: "Hamstrings",
    secondaryMuscles: ["glutes", "lower back", "upper back", "lats"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/17561201-Barbell-Single-Leg-Deadlift_Hips_.mp4",
    howToSteps: [
      "Grab a barbell with a double overhand grip at about shoulder width.",
      "Stand tall with your feet close together, shoulders back, and abs engaged.",
      "Hinge forward at the hips while lifting one leg straight back for balance and breathing in.",
      "Lower the barbell in a straight line close to your body until you feel a stretch in your hamstrings.",
      "Drive your hips forward to return to the upright position while breathing out.",
      "Repeat for the desired number of repetitions.",
      "Switch legs and perform the same number of repetitions on the opposite side.",
    ],
    isCustom: false,
  },

  {
    name: "Single Leg Romanian Deadlift (Dumbbell)",
    primaryMuscle: "Hamstrings",
    secondaryMuscles: ["glutes", "lower back"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/97541201-Dumbbell-Single-Leg-Romanian-Deadlift-Leg-Raise-(m.mp4",
    howToSteps: [
      "Hold a dumbbell in one hand and position it in front of your hip.",
      "Stand on one leg and lift the opposite foot off the floor for balance.",
      "Bring your shoulders back, engage your abs, and inhale.",
      "Hinge forward at the hips while allowing the lifted leg to extend behind you.",
      "Lower the weight until you feel a stretch in your hamstrings.",
      "Drive your hips forward, squeeze your glutes, and return to the upright position while breathing out.",
      "Switch sides and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Single Leg Standing Calf Raise",
    primaryMuscle: "Calves",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/50521201-Single-Leg-Calf-Raise-Off-Step_Calves_.mp4",
    howToSteps: [
      "Place the ball of one foot on an elevated platform and hold onto a support for balance.",
      "Stand tall, bring your shoulders back, engage your abs, and keep your working leg straight.",
      "Lower your heel toward the floor under control while breathing in.",
      "Press through the ball of your foot to raise your heel as high as possible while breathing out.",
      "Squeeze your calf briefly at the top of the movement.",
      "Switch legs and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Single Leg Standing Calf Raise (Barbell)",
    primaryMuscle: "Calves",
    secondaryMuscles: [],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/101691201-Barbell-Standing-Single-Leg-Calf-Raise_Calves_.mp4",
    howToSteps: [
      "Place a loaded barbell across your upper back as you would for a squat.",
      "Position the ball of one foot on an elevated platform and use your other foot lightly for balance.",
      "Stand tall, engage your abs, and take a breath.",
      "Press through the ball of your working foot to extend your ankle and raise your heel while breathing out.",
      "Lower your heel back down under control as you breathe in.",
      "Switch feet and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Single Leg Standing Calf Raise (Dumbbell)",
    primaryMuscle: "Calves",
    secondaryMuscles: [],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/39731201-Dumbbell-Single-Leg-Calf-Raise-(female)-(VERSION-2)_Calves.mp4",
    howToSteps: [
      "Hold a dumbbell in one hand and place the ball of the opposite foot on an elevated platform.",
      "Use your free hand to hold onto a support for balance.",
      "Engage your abs, straighten your working leg, and take a breath.",
      "Press through the ball of your foot to raise your heel while squeezing your calf and breathing out.",
      "Lower your heel back down under control as you breathe in.",
      "Switch sides and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Single Leg Standing Calf Raise (Machine)",
    primaryMuscle: "Calves",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/100761201-Lever-Standing-Single-Leg-Calf-Raise_Calves_.mp4",
    howToSteps: [
      "Select an appropriate load on the machine.",
      "Place the ball of one foot on the platform and position your shoulders firmly against the pads.",
      "Grab the handles for support, engage your abs, and take a breath.",
      "Press through the ball of your foot to extend your ankle and raise your heel while breathing out.",
      "Lower your heel slowly to feel a stretch in your calf as you breathe in.",
      "Switch legs and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Sissy Squat (Weighted)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/08511201-Weighted-Sissy-Squat_Thighs.mp4",
    howToSteps: [
      "Hold a weight plate in front of your chest with one arm.",
      "Stand in front of a bench or stable object you can hold for balance.",
      "Place your feet a few inches apart, engage your abs, and take a breath.",
      "Lower into a squat while leaning your torso back.",
      "Allow your heels to lift as you descend, supporting your weight on the balls of your feet.",
      "Lower as far as comfortable, feeling a stretch in your quadriceps.",
      "Drive through your quads to straighten your legs and return to standing while breathing out.",
    ],
    isCustom: false,
  },

  {
    name: "Sit Up",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00011201-3-4-Sit-up_Waist.mp4",
    howToSteps: [
      "Lie on an exercise mat with your knees bent and feet flat on the floor.",
      "Place your hands in front of your face or lightly behind your head.",
      "Engage your abs and lift your torso upward toward an upright position while breathing out.",
      "Pause briefly at the top, then lower your torso back down under control as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Sit Up (Weighted)",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/47561201-Dumbbell-Sit-up_Waist_.mp4",
    howToSteps: [
      "Lie on an exercise mat with a dumbbell or weight plate placed nearby.",
      "Bend your knees and plant your feet flat on the floor.",
      "Hold the weight securely against your chest.",
      "Engage your abs and lift your torso to an upright position while breathing out.",
      "Pause briefly at the top, then lower your torso back down slowly as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Skullcrusher (Barbell)",
    primaryMuscle: "Triceps",
    secondaryMuscles: [],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00601201-Barbell-Lying-Triceps-Extension-Skull-Crusher_Upper-Arms.mp4",
    howToSteps: [
      "Load a barbell and hold it in front of your chest.",
      "Sit on a flat bench and carefully lie back while keeping the bar close to your torso.",
      "Extend your arms over your chest, plant your feet on the floor, and set your shoulders.",
      "Lower the barbell toward your forehead or just behind your head while breathing in.",
      "Pause briefly, then extend your arms back to the starting position while breathing out.",
    ],
    isCustom: false,
  },

  {
    name: "Skullcrusher (Dumbbell)",
    primaryMuscle: "Triceps",
    secondaryMuscles: [],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/22511201-Dumbbell-Lying-Triceps-Extension-(female)_Upper-Arms_.mp4",
    howToSteps: [
      "Grab a pair of dumbbells and lie back on a flat bench.",
      "Extend your arms over your chest with a neutral grip, palms facing each other.",
      "Set your shoulders, engage your abs, and plant your feet on the floor.",
      "Lower the dumbbells by bending your elbows until they are beside your head while breathing in.",
      "Extend your arms back to the starting position by squeezing your triceps while breathing out.",
    ],
    isCustom: false,
  },

  {
    name: "Sled Push",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/25241201-Power-Sled-Push-(female)_Thighs.mp4",
    howToSteps: [
      "Load the sled with an appropriate amount of weight.",
      "Lean forward, grab the handles, and straighten your arms.",
      "Set your shoulders, engage your abs, and stay on the balls of your feet.",
      "Drive forward by pressing through your feet while breathing steadily.",
      "Continue pushing the sled forward under control for the desired distance or time.",
    ],
    isCustom: false,
  },

  {
    name: "Snatch",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/15331201-Barbell-Snatch_Weightlifts_.mp4",
    howToSteps: [
      "Stand with your feet under the barbell and your shins a few inches away.",
      "Grip the bar with a wide snatch grip and hinge forward.",
      "Lower your hips, straighten your back, and position your knees slightly over the bar.",
      "Engage your abs and take a breath.",
      "Drive powerfully through your heels to initiate the lift.",
      "As the bar reaches hip height, explosively extend your hips and knees while pulling the bar upward.",
      "Drop under the bar by bending your knees and catch it overhead with straight arms.",
      "Stand up from the overhead squat position while breathing out at the top.",
      "Lower the barbell back to the floor under control.",
    ],
    isCustom: false,
  },

  {
    name: "Spider Curl (Barbell)",
    primaryMuscle: "Biceps",
    secondaryMuscles: [],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00721201-Barbell-Prone-Incline-Curl_Upper-Arms.mp4",
    howToSteps: [
      "Set an incline bench to approximately 45 degrees.",
      "Lie face down on the bench with your chest and stomach against the support.",
      "Grab the barbell with an underhand grip, palms facing forward.",
      "Engage your abs and take a breath.",
      "Curl the barbell upward while keeping your elbows fixed in place.",
      "Lift until your wrists are slightly higher than your elbows, squeezing your biceps while breathing out.",
      "Lower the barbell slowly back to full arm extension as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Spider Curl (Dumbbell)",
    primaryMuscle: "Biceps",
    secondaryMuscles: [],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/03741201-Dumbbell-Prone-Incline-Curl_Upper-Arms.mp4",
    howToSteps: [
      "Set an incline bench to approximately 45 to 60 degrees.",
      "Sit on the bench and lean forward so your chest and stomach rest against the back support.",
      "Let your arms hang straight down with your palms facing forward while holding the dumbbells.",
      "Curl the dumbbells upward without moving your elbows forward while breathing out.",
      "Lower the dumbbells back to the starting position under control as you breathe in.",
    ],
    isCustom: false,
  },

  {
    name: "Spiderman",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/48791201-Spiderman-Plank_Waist_.mp4",
    howToSteps: [
      "Start in an elbow plank position with your forearms on the floor and legs extended.",
      "Keep your body stable with a neutral spine, slightly elevated hips, and engaged abs.",
      "Bring your right knee toward your right elbow while breathing out.",
      "Return your leg to the starting position as you breathe in.",
      "Bring your left knee toward your left elbow while breathing out.",
      "Continue alternating sides while maintaining core tension until the set is complete.",
    ],
    isCustom: false,
  },

  {
    name: "Spinning",
    primaryMuscle: "Cardio",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/22791201-Stationary-Bike-Run-(version-4)_Cardio.mp4",
    howToSteps: [
      "Adjust the seat height and get seated on the stationary bike.",
      "Select an appropriate program or resistance level and grab the handles.",
      "Place your feet securely on the pedals, bring your shoulders back, and look forward.",
      "Pedal steadily while maintaining controlled, consistent breathing.",
    ],
    isCustom: false,
  },

  {
    name: "Split Jerk",
    primaryMuscle: "Full Body",
    secondaryMuscles: [],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/15381201-Barbell-Split-Jerk_Weightlifts_.mp4",
    howToSteps: [
      "Hold the barbell at neck level with a wide grip and stand in a comfortable stance.",
      "Bring your shoulders back, engage your abs, and set your posture.",
      "Dip down a few inches by bending your knees while breathing in.",
      "Drive powerfully through your heels and thrust the barbell overhead.",
      "Quickly split your stance, placing one leg forward and the other back to receive the barbell overhead.",
      "Stabilize the weight, then bring your feet back in line.",
      "Lower the barbell back to neck level under control while breathing out.",
    ],
    isCustom: false,
  },

  {
    name: "Split Squat (Dumbbell)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/29601201-Dumbbell-Split-Squat_Thighs.mp4",
    howToSteps: [
      "Hold a pair of dumbbells at your sides and stand tall.",
      "Retract your shoulders, engage your abs, and step one leg forward into a split stance.",
      "Lower your body by bending your front knee while breathing in.",
      "Descend until your back knee nearly touches the floor.",
      "Press through the heel of your front foot to return to the starting position while breathing out.",
      "Switch legs and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Squat (Band)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Resistance Band",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/57491201-Band-squat-(female)_Hips_.mp4",
    howToSteps: [
      "Step onto a large looped resistance band with both feet.",
      "Position your feet in a comfortable squat stance.",
      "Grab the opposite end of the band, lift it overhead, and place it behind your neck.",
      "Stand tall, bring your shoulders back, engage your abs, and inhale.",
      "Lower into a squat until your thighs are roughly parallel to the floor.",
      "Press through your heels to return to standing while breathing out.",
    ],
    isCustom: false,
  },

  {
    name: "Squat (Barbell)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00431201-Barbell-Full-Squat_Thighs.mp4",
    howToSteps: [
      "Set the barbell at collarbone height on a squat rack.",
      "Grab the bar with an even overhand grip and step underneath it.",
      "Position the bar across your upper back on your trapezius muscles.",
      "Engage your abs, take a breath, and unrack the bar by straightening your legs.",
      "Step back carefully and set your feet about shoulder-width apart.",
      "Lower into a squat until your thighs are parallel to the floor while keeping your heels grounded.",
      "Press through your heels to stand back up while breathing out near the top.",
      "Step forward and rack the barbell safely once the set is complete.",
    ],
    isCustom: false,
  },

  {
    name: "Squat (Bodyweight)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/11971201-Squat-m_Thighs.mp4",
    howToSteps: [
      "Stand tall with your feet in a comfortable stance, shoulders back, and eyes facing forward.",
      "Raise your arms in front of you for balance and take a breath.",
      "Lower into a squat while keeping your heels flat on the floor.",
      "Descend until your thighs are parallel to the ground.",
      "Press through your heels to return to standing while breathing out.",
    ],
    isCustom: false,
  },

  {
    name: "Squat (Dumbbell)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/04131201-Dumbbell-Squat_Hips_.mp4",
    howToSteps: [
      "Hold a pair of dumbbells at your sides and stand tall.",
      "Bring your shoulders back, engage your abs, and set your feet in a comfortable stance.",
      "Lower into a squat by bending your knees while breathing in.",
      "Descend until your thighs are parallel to the floor while keeping your heels grounded.",
      "Press through your heels to return to standing while breathing out near the top.",
    ],
    isCustom: false,
  },

  {
    name: "Squat (Machine)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/57881201-Lever-Squat-(plate-loaded)-(female)_Thighs_.mp4",
    howToSteps: [
      "Position your back and shoulders firmly against the machine pad.",
      "Place your feet about hip-width apart with your toes slightly turned out.",
      "Bring your shoulders back, engage your abs, and take a breath.",
      "Release the safety lever to unrack the weight.",
      "Lower into a squat by bending your knees while keeping your heels flat on the floor.",
      "Descend until your thighs are parallel to the floor.",
      "Press through your heels to return to the starting position while breathing out.",
      "Re-engage the safety lever to rack the weight once finished.",
    ],
    isCustom: false,
  },

  {
    name: "Squat (Smith Machine)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/07501201-Smith-Chair-Squat_Thighs.mp4",
    howToSteps: [
      "Set the Smith machine bar just below collarbone height.",
      "Grab the bar with an overhand grip and position it across your upper back.",
      "Step your feet slightly forward and place them about hip-width apart.",
      "Extend your knees to unrack the bar.",
      "Lower into a squat by bending your knees while breathing in.",
      "Descend until your thighs are parallel to the floor.",
      "Press through your heels to return to standing while breathing out.",
      "Rotate the bar to rack it safely once the set is complete.",
    ],
    isCustom: false,
  },

  {
    name: "Squat Row",
    primaryMuscle: "Full Body",
    secondaryMuscles: [
      "upper back",
      "lats",
      "quadriceps",
      "glutes",
      "hamstrings",
      "biceps",
    ],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/17171201-Cable-Squat-Row-(with-rope-attachment)_Back_Thighs.mp4",
    howToSteps: [
      "Select an appropriate load on the cable machine.",
      "Set the pulley at hip height and attach a rope or handle.",
      "Grab the attachment, step back to lift the weight, and pull your shoulders back.",
      "With arms straight, descend into a squat.",
      "Lower until your thighs are parallel to the floor.",
      "Press through your heels to stand up and immediately row the weight toward your stomach while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Stair Machine (Steps)",
    primaryMuscle: "Cardio",
    secondaryMuscles: [
      "quadriceps",
      "glutes",
      "hamstrings",
      "calves",
      "abdominals",
    ],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/23111201-Walking-on-Stepmill_Cardio.mp4",
    howToSteps: [
      "Step onto the stair machine and turn it on.",
      "Select a low speed and hold the handrails for balance if needed.",
      "Climb the moving stairs while keeping your shoulders back and core engaged.",
      "Maintain a steady breathing rhythm throughout the movement.",
      "Gradually increase the speed to a sustainable pace once you are comfortable.",
    ],
    isCustom: false,
  },

  {
    name: "Standing Cable Glute Kickbacks",
    primaryMuscle: "Glutes",
    secondaryMuscles: ["hamstrings"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/60401201-Cable-Donkey-Kickback-(male)_Hips_.mp4",
    howToSteps: [
      "Set the pulley to the lowest position and select an appropriate weight.",
      "Attach an ankle strap to the pulley.",
      "Face the machine and secure the strap around one ankle just above the foot.",
      "Lean forward slightly, hold the machine for balance, and engage your core.",
      "Extend the working leg straight back in a controlled motion, squeezing your glute at the top while exhaling.",
      "Slowly return the leg to the starting position while inhaling.",
      "Switch ankles and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Standing Calf Raise",
    primaryMuscle: "Calves",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/13731101-Bodyweight-Standing-Calf-Raise_Calves_small.jpg",
    howToSteps: [
      "Stand tall with your feet together, knees extended, shoulders back, and arms at your sides.",
      "Take a breath and brace your posture.",
      "Press through the balls of your feet to raise your heels off the ground while exhaling.",
      "Slowly lower your heels back to the starting position while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Standing Calf Raise (Barbell)",
    primaryMuscle: "Calves",
    secondaryMuscles: [],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/01081201-Barbell-Standing-Leg-Calf-Raise_Calves.mp4",
    howToSteps: [
      "Position a barbell across your upper back behind the neck and hold it securely with both hands.",
      "Place the balls of your feet on an elevated platform with your heels hanging down.",
      "Stand tall, bring your shoulders back, and engage your core.",
      "Press through the balls of your feet to raise your heels and squeeze your calves while exhaling.",
      "Lower your heels slowly without resting them fully on the platform while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Standing Calf Raise (Dumbbell)",
    primaryMuscle: "Calves",
    secondaryMuscles: [],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/04171201-Dumbbell-Standing-Calf-Raise_Calves.mp4",
    howToSteps: [
      "Hold a dumbbell in one hand while standing upright.",
      "Place the balls of your feet on an elevated platform with your heels hanging off.",
      "Use your free hand to hold onto a stable surface for balance.",
      "Keep your knees extended, squeeze your glutes, engage your core, and pull your shoulders back.",
      "Lower your heels as far as possible to feel a stretch in your calves while inhaling.",
      "Pause briefly at the bottom position.",
      "Press through the balls of your feet to raise your heels and squeeze your calves at the top while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Standing Calf Raise (Machine)",
    primaryMuscle: "Calves",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/06051201-Lever-Standing-Calf-Raise_Calves.mp4",
    howToSteps: [
      "Select an appropriate load on the calf raise machine.",
      "Position your shoulders and upper back firmly against the machine’s pad.",
      "Place the balls of your feet on the platform with your heels hanging down and knees extended.",
      "Hold the handles near the pad for stability.",
      "Press through the balls of your feet to extend your ankles and squeeze your calves at the top while exhaling.",
      "Lower yourself slowly to feel a stretch in your calves while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Standing Calf Raise (Smith)",
    primaryMuscle: "Calves",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/11641201-Smith-Calf-Raise-(version-2)_Calves.mp4",
    howToSteps: [
      "Set the Smith machine bar at a height that allows you to unrack it with your knees fully extended.",
      "Load the desired weight and place a calf raise block or platform under the bar.",
      "Position the bar across your upper back, grip it with both hands, and place the balls of your feet on the platform.",
      "Engage your body and straighten your knees to unrack the bar.",
      "Lower your heels slowly by allowing your ankles to flex while keeping your knees extended and inhaling.",
      "Pause briefly at the bottom, then press through the balls of your feet to extend your ankles and squeeze your calves while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Standing Leg Curls",
    primaryMuscle: "Hamstrings",
    secondaryMuscles: ["calves"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/51811201-Lever-Standing-Single-Leg-Curl-(plate-loaded)_Thig.mp4",
    howToSteps: [
      "Select an appropriate weight on the leg curl machine.",
      "Stand tall, hold the handles for support, and position one Achilles heel against the machine’s pad.",
      "Pull your shoulders back, engage your core, and take a breath.",
      "Slowly bend your working leg until your ankle rises slightly above knee level.",
      "Squeeze your hamstring at the top of the movement while exhaling.",
      "Lower the leg back to the starting position in a controlled manner while inhaling.",
      "Switch legs and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Standing Military Press (Barbell)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["triceps"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/11651201-Barbell-Standing-Military-Press-(without-rack)_Shoulders.mp4",
    howToSteps: [
      "Set the barbell at collarbone height on a rack or stand.",
      "Stand close to the bar and grip it with an overhand grip at shoulder-width.",
      "Duck under the bar, position it across your upper chest, and retract your shoulders.",
      "Engage your glutes, take a breath, and unrack the bar by extending your legs.",
      "Step back, set your feet at hip-width, keep your back straight, and look forward.",
      "Brace your core and press the bar upward in a straight vertical path while driving through your elbows.",
      "Press until your elbows lock out and exhale at the top.",
      "Lower the bar back to neck level in a controlled manner while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Step Up",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/94901201-Step-Up-on-Box_Thighs_.mp4",
    howToSteps: [
      "Stand in front of a flat bench or plyometric box with your feet hip-width apart and toes slightly pointed out.",
      "Pull your shoulders back and engage your core.",
      "Lift one leg and place the foot firmly on the elevated platform while inhaling.",
      "Press through the heel to extend your body and step fully onto the platform while exhaling.",
      "Step back down in a controlled manner and repeat with the opposite leg.",
    ],
    isCustom: false,
  },

  {
    name: "Sternum Pull Up (Gironda)",
    primaryMuscle: "Lats",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/04661201-Sternum-Pull-up-(Gironda)_Back_.mp4",
    howToSteps: [
      "Grab the pull-up bar with an overhand grip, hands shoulder-width apart or slightly wider.",
      "Pull your shoulders back, engage your core, and squeeze your glutes.",
      "Retract your shoulder blades as much as possible and lean your torso slightly back.",
      "Pull yourself upward until your lower chest touches the bar while exhaling.",
      "Lower yourself under control back to the starting position while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Straight Arm Lat Pulldown (Cable)",
    primaryMuscle: "Lats",
    secondaryMuscles: ["triceps"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02381201-Cable-Straight-Arm-Pulldown_Back.mp4",
    howToSteps: [
      "Select an appropriate load on the cable machine.",
      "Set the pulley to the highest position and attach a straight bar.",
      "Grab the bar with an overhand grip, palms facing down.",
      "Step back slightly to lift the weight from the stack.",
      "Engage your core, retract your shoulder blades, and squeeze your glutes. Use a staggered stance if needed for balance.",
      "Pull the bar down toward your hips in a smooth motion with straight arms while exhaling.",
      "Allow the bar to travel back up under control while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Straight Leg Deadlift",
    primaryMuscle: "Hamstrings",
    secondaryMuscles: ["glutes", "lower back", "upper back", "lats"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/01161201-Barbell-Straight-Leg-Deadlift_Thighs.mp4",
    howToSteps: [
      "Stand in front of a loaded barbell with your feet under the bar and shins a few inches away.",
      "Hinge forward at the hips and grab the bar with a double overhand grip.",
      "Pull your shoulders back, brace your core, and keep your legs straight.",
      "Take a breath and lift the bar in a straight vertical line by pushing through your heels.",
      "Squeeze your glutes at the top of the movement while exhaling.",
      "Lower the bar back down in the same straight path under control while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Sumo Deadlift",
    primaryMuscle: "Glutes",
    secondaryMuscles: [
      "hamstrings",
      "quadriceps",
      "lower back",
      "upper back",
      "lats",
    ],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/01171201-Barbell-Sumo-Deadlift_Hips.mp4",
    howToSteps: [
      "Stand in front of a loaded barbell with a wide stance and toes pointed outward, shins close to the bar.",
      "Hinge forward and grip the bar with a double overhand grip, hands about shoulder-width apart.",
      "Pull your shoulders back, lift your chest, and set your back flat while bringing your shins to the bar.",
      "Brace your core, keep your arms straight, and take a deep breath into your belly.",
      "Drive through your heels to lift the bar off the floor.",
      "Extend your hips and knees together as the bar travels upward in a straight line close to your body.",
      "Squeeze your glutes at the top of the movement and exhale without overextending your back.",
      "Lower the bar back down along the same vertical path while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Sumo Squat",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/10641201-Sumo-Squat-(male)_Thighs-FIX_.mp4",
    howToSteps: [
      "Stand tall with a wider-than-shoulder-width stance and toes pointed outward.",
      "Pull your shoulder blades back and raise your arms in front of you for balance.",
      "Take a deep breath, engage your core, and begin squatting down.",
      "Lower until your thighs are parallel to the floor, then press through your heels to return to standing while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Sumo Squat (Barbell)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/10631201-Barbell-sumo-squat_Thighs.mp4",
    howToSteps: [
      "Set the barbell at collarbone height on a squat rack.",
      "Grip the bar evenly with hands slightly wider than shoulder-width.",
      "Step under the bar and position it across your upper back.",
      "Plant your feet, take a breath, and unrack the bar.",
      "Step back and assume a wide stance with your toes pointed outward.",
      "Lift your chest, brace your core, and inhale.",
      "Lower into a squat while keeping your heels in contact with the floor.",
      "Descend until your thighs are parallel to the floor, pause briefly, then drive through your heels to stand up while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Sumo Squat (Dumbbell)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/23221201-Dumbbell-Sumo-Squat-(female)_Thighs_.mp4",
    howToSteps: [
      "Place a dumbbell upright on the floor and stand in front of it.",
      "Squat down and grip the top of the dumbbell securely with both hands.",
      "Stand tall and set a wide, comfortable stance with your toes slightly pointed outward.",
      "Take a deep breath and engage your core.",
      "Lower into a squat until your thighs are parallel to the floor.",
      "Press through your heels to return to standing while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Sumo Squat (Kettlebell)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/50731201-Kettlebell-Sumo-Squat-(VERSION-2)_Hips_.mp4",
    howToSteps: [
      "Hold a kettlebell by the handle with arms straight and the weight hanging in front of your body.",
      "Set a wider-than-shoulder-width stance with your toes pointed outward.",
      "Pull your shoulder blades back, take a deep breath, and brace your core.",
      "Lower into a squat until your thighs are parallel to the floor and pause briefly.",
      "Drive through your heels to stand back up while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Superman",
    primaryMuscle: "Lower Back",
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/68861201-Superman-Hold-(male)_Hips_.mp4",
    howToSteps: [
      "Lie face down on the floor with your legs straight and arms extended overhead.",
      "Keep your toes, knees, thighs, hips, stomach, and chest in contact with the floor.",
      "Take a breath, then lift your arms and legs toward the ceiling as high as possible while exhaling.",
      "Hold the raised position for a few seconds, then relax and lower back down while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "T Bar Row",
    primaryMuscle: "Upper Back",
    secondaryMuscles: ["lats", "biceps", "forearms"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/06061201-Lever-T-bar-Row-(plate-loaded)_Back.mp4",
    howToSteps: [
      "Load the desired weight onto the T-bar station.",
      "Step onto the platform, hinge forward, and grab the handles with an overhand grip.",
      "Retract your shoulder blades, brace your core, and inhale.",
      "Drive through your heels and slightly extend your hips to lift the weight off the floor while keeping a neutral spine.",
      "Keep your torso nearly parallel to the floor with your arms extended.",
      "Pull the handles toward your torso while exhaling at the top of the movement.",
      "Lower the weight by extending your arms under control while inhaling, without setting it down.",
    ],
    isCustom: false,
  },

  {
    name: "Thruster (Barbell)",
    primaryMuscle: "Full Body",
    secondaryMuscles: [
      "quadriceps",
      "glutes",
      "hamstrings",
      "shoulders",
      "triceps",
      "abdominals",
    ],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/33051201-Barbell-Thruster_Weightlifting_.mp4",
    howToSteps: [
      "Hold the barbell in a front rack position, resting on your shoulders with elbows bent and fingertips supporting the bar.",
      "Set your feet in a comfortable squat stance.",
      "Engage your core and take a breath.",
      "Lower into a squat while keeping your heels flat on the floor.",
      "Descend until your thighs are parallel to the floor.",
      "Drive through your heels to stand up.",
      "As your legs fully extend, immediately press the barbell overhead and exhale.",
      "Lower the bar back to the front rack position while inhaling.",
      "Transition smoothly into the next repetition.",
    ],
    isCustom: false,
  },

  {
    name: "Thruster (Kettlebell)",
    primaryMuscle: "Full Body",
    secondaryMuscles: [
      "quadriceps",
      "glutes",
      "hamstrings",
      "shoulders",
      "triceps",
      "abdominals",
    ],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/05501201-Kettlebell-Thruster_Shoulders-FIX_.mp4",
    howToSteps: [
      "Hold a pair of kettlebells in the rack position at shoulder level with elbows bent and bells resting against your forearms.",
      "Stand with your feet hip-width apart and toes slightly pointed outward.",
      "Pull your shoulders back, engage your core, take a breath, and descend into a squat.",
      "Lower until your thighs are parallel to the floor, then drive upward through your heels.",
      "As you reach full hip and knee extension, press the kettlebells overhead and exhale.",
      "Lower the kettlebells back to the rack position while inhaling and smoothly transition into the next squat.",
    ],
    isCustom: false,
  },

  {
    name: "Toe Touch",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/52751201-Lying-Toe-Touch_Waist_.mp4",
    howToSteps: [
      "Lie flat on the floor, extend your legs straight up toward the ceiling, and keep them together.",
      "Raise your arms over your chest with your fingers pointing upward and engage your core.",
      "Take a breath and crunch your abs to lift your shoulder blades off the floor.",
      "Reach your hands toward your toes in one fluid motion while exhaling.",
      "Lower your upper back back to the floor under control while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Toes to Bar",
    primaryMuscle: "Abdominals",
    secondaryMuscles: ["forearms"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/04741201-Hanging-Straight-Leg-Hip-Raise_Waist.mp4",
    howToSteps: [
      "Grab a pull-up bar with an overhand grip and hang with your arms fully extended.",
      "Bring your feet together and lift them off the floor to suspend your body.",
      "Retract your shoulder blades and engage your core.",
      "Take a breath and raise your legs upward in one controlled motion.",
      "Lift your legs as high as possible, ideally bringing your toes close to the bar while exhaling.",
      "Lower your legs back to the starting position under control while inhaling, keeping your abs tight to minimize swinging.",
    ],
    isCustom: false,
  },

  {
    name: "Torso Rotation",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/100651201-Lever-Torso-Rotation-(male)_Waist_.mp4",
    howToSteps: [
      "Select an appropriate weight on the torso rotation machine.",
      "Adjust the seat height so your forearms rest comfortably on the side pads and grip the handles.",
      "Bend your knees, place your shins against the lower pads, and brace your entire body.",
      "Inhale, then rotate your lower body to one side in a smooth, controlled motion while exhaling.",
      "Return to the center position slowly while inhaling.",
      "Rotate to the opposite side while exhaling.",
      "Continue alternating sides with controlled movement and steady breathing.",
    ],
    isCustom: false,
  },

  {
    name: "Treadmill",
    primaryMuscle: "Cardio",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/21971201-Run-on-Treadmill-(female)_Cardio.mp4",
    howToSteps: [
      "Step onto the treadmill and clip the safety key to your clothing.",
      "Start the treadmill and gradually increase the speed from a slow walk to a comfortable jog.",
      "Maintain an upright posture with your gaze forward and breathe steadily.",
      "Keep your arms bent and swing them naturally in sync with your stride.",
    ],
    isCustom: false,
  },

  {
    name: "Triceps Dip",
    primaryMuscle: "Triceps",
    secondaryMuscles: ["shoulders"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/08141201-Triceps-Dip_Upper-Arms.mp4",
    howToSteps: [
      "Grip a pair of parallel bars and lift yourself so your arms are fully extended.",
      "Keep your body upright, pull your shoulders back, and engage your core.",
      "Inhale and slowly lower your body by bending your elbows.",
      "Descend until your elbows reach approximately a 90-degree angle.",
      "Pause briefly, then press yourself back up to the starting position while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Triceps Dip (Assisted)",
    primaryMuscle: "Triceps",
    secondaryMuscles: ["shoulders"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00191201-Assisted-Triceps-Dip-(kneeling)_Upper-Arms.mp4",
    howToSteps: [
      "Select an appropriate assistance load on the machine.",
      "Grip the parallel bars, place your knees on the support platform, and bring your legs together.",
      "Retract your shoulder blades, straighten your arms, and engage your core.",
      "Inhale and lower your body by bending your elbows.",
      "Descend until your elbows reach about a 90-degree angle, pause briefly, then press back up while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Triceps Dip (Weighted)",
    primaryMuscle: "Triceps",
    secondaryMuscles: ["shoulders"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/17551201-Weighted-Tricep-Dips_Upper-Arms_.mp4",
    howToSteps: [
      "Attach a weight plate to your body using a dipping belt.",
      "Grip the parallel bars and lift yourself so your arms are fully extended.",
      "Keep your torso upright, pull your shoulders back, and engage your core.",
      "Inhale and lower your body by bending your elbows.",
      "Descend until your elbows reach approximately a 90-degree angle.",
      "Pause briefly, then press yourself back up to the starting position while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Triceps Extension (Barbell)",
    primaryMuscle: "Triceps",
    secondaryMuscles: [],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/00921201-Barbell-Seated-Overhead-Triceps-Extension_Upper-Arms.mp4",
    howToSteps: [
      "Load an appropriate amount of weight onto the barbell.",
      "Grab the bar with an even overhand grip, palms facing back.",
      "Pull your shoulders back and engage your core.",
      "Lift the bar to chest height and sit down on a flat bench.",
      "Press the bar overhead and fully extend your arms.",
      "Inhale and lower the bar behind your head until you feel a stretch in your triceps.",
      "Pause briefly at the bottom, then extend your arms to return to the top while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Triceps Extension (Cable)",
    primaryMuscle: "Triceps",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/01491201-Cable-Alternate-Triceps-Extension_Upper-Arms_.mp4",
    howToSteps: [
      "Set the cable pulley to a low position and attach a single handle.",
      "Select a light to moderate load using the weight stack pin.",
      "Grab the handle with one hand and turn your body away from the cable machine.",
      "Extend your working arm overhead and place your free hand on your elbow for support.",
      "Retract your shoulder blades, engage your core, and take a breath.",
      "Lower the handle by bending your elbow until you feel a stretch in your triceps.",
      "Extend your arm by flexing your triceps and exhale near the top.",
      "Switch arms and repeat for the same number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Triceps Extension (Dumbbell)",
    primaryMuscle: "Triceps",
    secondaryMuscles: [],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/04301201-Dumbbell-Standing-Triceps-Extension_Upper-Arms.mp4",
    howToSteps: [
      "Hold a dumbbell with both hands and stand tall.",
      "Lift the dumbbell overhead and place your palms against the top weight plate with palms facing upward.",
      "Pull your shoulders back and engage your core.",
      "Inhale and lower the dumbbell behind your head while keeping your elbows close to your head.",
      "Lower until you feel a stretch in your triceps, then extend your elbows to raise the weight while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Triceps Extension (Machine)",
    primaryMuscle: "Triceps",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/10331201-Lever-Triceps-Extension_Upper-Arms.mp4",
    howToSteps: [
      "Select an appropriate load on the machine and sit down.",
      "Grip the handles at your sides, press your shoulders back into the pad, and plant your feet firmly on the floor.",
      "Inhale and push the handles down by extending your elbows.",
      "Fully straighten your arms and briefly hold the position while exhaling.",
      "Slowly bend your elbows to return to the starting position while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Triceps Kickback (Cable)",
    primaryMuscle: "Triceps",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/45661201-Cable-Neutral-Grip-Kickback_Upper-arms_.mp4",
    howToSteps: [
      "Set the cable pulley to a low position and select an appropriate weight without attaching a handle.",
      "Grab the end of the cable with one hand and step back to create tension.",
      "Hinge forward at the hips while keeping your back straight.",
      "Raise your elbow so it stays close to your torso and inhale.",
      "Extend your arm fully by contracting your triceps and exhale at the top.",
      "Bend your arm slowly to return to the starting position while inhaling.",
      "Repeat for the desired number of repetitions, then switch arms.",
    ],
    isCustom: false,
  },

  {
    name: "Triceps Kickback (Dumbbell)",
    primaryMuscle: "Triceps",
    secondaryMuscles: [],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/03331201-Dumbbell-Kickback_Upper-Arms.mp4",
    howToSteps: [
      "Hold a light dumbbell at your side with your palm facing your thigh.",
      "Hinge forward at the hips while pushing your hips back and keeping a neutral spine.",
      "Raise your elbow so it stays close to your torso, inhale, then extend your arm by contracting your triceps while exhaling.",
      "Pause briefly at the top of the movement.",
      "Lower the dumbbell back to the starting position under control while inhaling, keeping your shoulder and elbow stationary.",
    ],
    isCustom: false,
  },

  {
    name: "Triceps Pressdown",
    primaryMuscle: "Triceps",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/16051201-Cable-Triceps-Pushdown-(SZ-bar)_Upper-arms.mp4",
    howToSteps: [
      "Select an appropriate weight on the cable machine.",
      "Set the pulley to the highest position and attach a straight or V-shaped bar.",
      "Grip the bar with an even overhand grip, palms facing down.",
      "Bring your elbows close to your sides, step back slightly, and retract your shoulder blades.",
      "Engage your core and take a breath.",
      "Extend your arms fully to press the bar down and briefly hold the bottom position while exhaling.",
      "Slowly bend your elbows to return to the starting position while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Triceps Pushdown",
    primaryMuscle: "Triceps",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02011201-Cable-Pushdown_Upper-Arms.mp4",
    howToSteps: [
      "Select an appropriate load on the cable machine, set the pulley to the highest position, and attach a bar.",
      "Grab the bar with an even overhand grip and bring your elbows close to your sides.",
      "Step back slightly and lean your torso forward just a bit.",
      "Retract your shoulder blades, engage your core, and take a breath.",
      "Extend your arms fully while keeping your elbows pinned to your sides and exhale at the bottom.",
      "Slowly bend your arms to return to the starting position while inhaling, keeping control throughout.",
    ],
    isCustom: false,
  },

  {
    name: "Triceps Rope Pushdown",
    primaryMuscle: "Triceps",
    secondaryMuscles: [],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/24381201-Cable-Pushdown-(with-rope-attachment)-(female)_Upper-Arms.mp4",
    howToSteps: [
      "Select an appropriate weight on the cable machine, set the pulley to the highest position, and attach a rope.",
      "Grip the rope with both hands and bring your elbows close to your sides.",
      "Step back slightly and lean your torso forward just a bit.",
      "Inhale, then extend your arms downward while keeping your elbows fixed and exhale at the bottom.",
      "Slowly bend your elbows to return to the starting position while inhaling, stopping when your wrists are slightly higher than your elbows.",
    ],
    isCustom: false,
  },

  {
    name: "Upright Row (Barbell)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/01211201-Barbell-Upright-Row_Shoulders.mp4",
    howToSteps: [
      "Grip the barbell with an overhand grip, hands about shoulder-width apart.",
      "Stand tall, retract your shoulder blades, engage your core, and take a breath.",
      "Pull the barbell upward in a straight line from your hips toward your chest while exhaling.",
      "Squeeze your shoulders and upper back at the top of the movement.",
      "Lower the barbell back down under control while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Upright Row (Cable)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02461201-Cable-Upright-Row_shoulder.mp4",
    howToSteps: [
      "Set the cable pulley to the lowest position and attach a straight bar.",
      "Select an appropriate weight on the stack.",
      "Grab the bar with an overhand grip and stand upright, stepping back to lift the weight.",
      "Pull your shoulders back, engage your core, and stagger your stance slightly for balance.",
      "Inhale, then pull the bar upward toward your upper chest in one smooth motion while exhaling.",
      "Lower the bar back down under control while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Upright Row (Barbell)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/01211201-Barbell-Upright-Row_Shoulders.mp4",
    howToSteps: [
      "Grab the barbell with an overhand grip, hands about shoulder-width apart.",
      "Stand tall, retract your shoulder blades, engage your core, and take a breath.",
      "Pull the barbell upward in a straight line from your hips toward your chest while exhaling.",
      "Squeeze your shoulders and upper back at the top of the movement.",
      "Lower the barbell back down under control while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Upright Row (Cable)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/02461201-Cable-Upright-Row_shoulder.mp4",
    howToSteps: [
      "Set the cable pulley to the lowest position and attach a straight bar.",
      "Select an appropriate weight on the stack.",
      "Grab the bar with an overhand grip and stand upright, stepping back to lift the weight.",
      "Pull your shoulders back, engage your core, and stagger your stance slightly for balance.",
      "Inhale, then pull the bar upward toward your upper chest in one smooth motion while exhaling.",
      "Lower the bar back down under control while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Upright Row (Dumbbell)",
    primaryMuscle: "Shoulders",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/04371201-Dumbbell-Upright-Row_shoulder.mp4",
    howToSteps: [
      "Hold a pair of dumbbells and stand tall with a comfortable stance, arms fully extended in front of your body.",
      "Retract your shoulders, engage your core, and keep the dumbbells close to your thighs.",
      "Inhale, then pull the dumbbells upward in a straight vertical line toward your upper chest while exhaling at the top.",
      "Squeeze your shoulders and upper back briefly at the top of the movement.",
      "Lower the dumbbells back down under control while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "V Up",
    primaryMuscle: "Abdominals",
    secondaryMuscles: [],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/08251201-V-up_Waist.mp4",
    howToSteps: [
      "Lie flat on the floor with your legs straight, feet together, and arms extended overhead.",
      "Engage your core and take a breath.",
      "Lift your legs and upper body at the same time, folding into a V shape while exhaling.",
      "Pause briefly at the top position.",
      "Lower your torso and legs back down under control while inhaling, keeping your feet off the floor between repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Waiter Curl (Dumbbell)",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["forearms"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/52011201-Dumbbell-Waiter-Biceps-Curl_Upper-Arms_.mp4",
    howToSteps: [
      "Hold a dumbbell vertically and place your hands flat against the underside of the top weight plate with thumbs on top for support.",
      "Stand tall with your feet slightly wider than hip-width and lean forward just a bit.",
      "Lift your chest, engage your core, and inhale.",
      "Curl the dumbbell upward until your wrists are slightly higher than your elbows and pause briefly while exhaling.",
      "Lower the dumbbell slowly until your arms are fully extended while inhaling.",
      "Repeat for the desired number of repetitions.",
    ],
    isCustom: false,
  },

  {
    name: "Walking Lunge",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/14601201-Walking-Lunge-Male_Hips.mp4",
    howToSteps: [
      "Stand tall, retract your shoulder blades, and engage your core.",
      "Step forward with one leg and plant your foot firmly on the floor while inhaling.",
      "Lower your body into a lunge until your back knee is just above the ground.",
      "Press through the front foot to stand up and exhale.",
      "Bring the back leg forward into the next step and immediately descend into another lunge while inhaling.",
      "Continue alternating steps and moving forward until all repetitions are completed.",
    ],
    isCustom: false,
  },

  {
    name: "Walking Lunge (Dumbbell)",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["glutes", "hamstrings"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/15571201-Dumbbell-Walking-Lunges_Thighs_.mp4",
    howToSteps: [
      "Hold a pair of dumbbells at your sides and stand tall.",
      "Retract your shoulder blades, engage your core, and take a breath.",
      "Step forward with one leg and plant your foot firmly on the floor.",
      "Lower into a lunge until your back knee is just above the ground.",
      "Drive through the front foot to stand up while exhaling.",
      "Bring the back leg forward into the next step and descend into another lunge while inhaling.",
      "Continue moving forward until all repetitions are completed.",
    ],
    isCustom: false,
  },

  {
    name: "Wall Ball",
    primaryMuscle: "Full Body",
    secondaryMuscles: [
      "quadriceps",
      "glutes",
      "hamstrings",
      "shoulders",
      "triceps",
      "abdominals",
    ],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/51611201-Medicine-Ball-Throw-Squat-with-Wall_Shoulders_.mp4",
    howToSteps: [
      "Hold a medicine ball at chest level and stand facing a wall.",
      "Set your feet in a comfortable squat stance with toes slightly pointed outward.",
      "Engage your core and take a breath.",
      "Lower into a squat while keeping your heels flat on the floor.",
      "Descend until your thighs are parallel to the floor.",
      "Drive through your heels to stand up.",
      "As your legs extend, throw the ball upward against the wall while exhaling.",
      "Catch the ball immediately, inhale, and descend into the next squat.",
    ],
    isCustom: false,
  },

  {
    name: "Wall Sit",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["abdominals"],
    equipment: "Other",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/66961201-Sit-(wall)-(female)_Thighs_.mp4",
    howToSteps: [
      "Stand with your back facing a wall and position yourself a few inches away from it.",
      "Lean back and place your upper back and hips flat against the wall.",
      "Engage your core and slowly bend your knees to lower into a squat position.",
      "Adjust your feet so your ankles are under your knees and your thighs are roughly parallel to the floor.",
      "Place your arms at your sides or in front of your body for comfort.",
      "Hold the position for 30 to 60 seconds while breathing steadily.",
    ],
    isCustom: false,
  },

  {
    name: "Wide Pull Up",
    primaryMuscle: "Lats",
    secondaryMuscles: ["upper back", "biceps", "forearms"],
    equipment: "Bodyweight",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/14291201-Wide-Grip-Pull-Up_Back.mp4",
    howToSteps: [
      "Grab a pull-up bar with a wide overhand grip, hands wider than shoulder-width but not excessively wide.",
      "Pull your shoulders back, engage your core, and lift your feet off the floor to hang freely.",
      "Inhale, then pull yourself upward in one smooth motion until your chin clears the bar while exhaling.",
      "Pause briefly at the top position.",
      "Lower yourself back down under control while inhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Wide-Elbow Triceps Press (Dumbbell)",
    primaryMuscle: "Triceps",
    secondaryMuscles: ["shoulders"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/04361201-Dumbbell-Tate-Press_Triceps.mp4",
    howToSteps: [
      "Hold a pair of dumbbells and sit down on a flat bench, resting the weights on your thighs.",
      "Lie back carefully and position the dumbbells close to your chest with elbows bent.",
      "Plant your feet firmly on the floor, pull your shoulders back, and engage your core.",
      "Press the dumbbells upward to extend your arms, keeping your palms facing forward.",
      "Inhale, then slowly bend your elbows to lower the dumbbells inward toward your chest, allowing your elbows to flare slightly.",
      "Lower the weights in a controlled manner, then extend your arms to return to the top while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Wrist Roller",
    primaryMuscle: "Forearms",
    secondaryMuscles: ["shoulders"],
    equipment: "Machine",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/08591201-Wrist-Roller_Forearms_.mp4",
    howToSteps: [
      "Hold a wrist roller with a weight plate attached to the rope or strap.",
      "Stand tall and raise your arms straight out in front of your body with palms facing down.",
      "Pull your shoulders back, engage your core, and take a breath.",
      "Begin rolling the handle to wind the weight upward while inhaling.",
      "Once the weight reaches the top, reverse the motion to slowly lower it back down.",
      "Continue rolling in both directions with steady breathing for the desired duration.",
    ],
    isCustom: false,
  },

  {
    name: "Zercher Squat",
    primaryMuscle: "Quadriceps",
    secondaryMuscles: ["hamstrings", "glutes", "biceps"],
    equipment: "Barbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/15451201-Barbell-full-Zercher-Squat_Thighs.mp4",
    howToSteps: [
      "Set the barbell at approximately belly button height on a rack.",
      "Step up to the bar and place the creases of your elbows underneath it.",
      "Bend your arms to create a shelf and hold the barbell securely against your torso.",
      "Step back carefully, lift your chest, brace your core, and take a deep breath.",
      "Lower into a squat by sitting back and down while keeping your heels on the floor and torso upright.",
      "Descend as far as comfortably possible, then drive through your heels to stand back up while exhaling.",
    ],
    isCustom: false,
  },

  {
    name: "Zottman Curl (Dumbbell)",
    primaryMuscle: "Biceps",
    secondaryMuscles: ["forearms"],
    equipment: "Dumbbell",
    imageUrl:
      "https://d2l9nsnmtah87f.cloudfront.net/exercise-assets/04391201-Dumbbell-Zottman-Curl_Upper-Arms-FIX.mp4",
    howToSteps: [
      "Hold a pair of dumbbells at your sides and stand tall.",
      "Position the dumbbells in front of your thighs with palms facing forward.",
      "Engage your core and take a breath.",
      "Curl the dumbbells upward until your wrists are slightly higher than your elbows while exhaling.",
      "At the top, rotate your wrists so your palms face downward and lower the dumbbells under control while inhaling.",
      "Rotate your wrists back to the starting position and repeat.",
    ],
    isCustom: false,
  },
];

async function main() {
  console.log("🌱 Seeding exercises...");

  for (const ex of exercises) {
    // 1. Check if it exists
    const exists = await prisma.exercise.findFirst({
      where: {
        name: {
          equals: ex.name.trim(),
          mode: "insensitive",
        },
        equipment: ex.equipment.toLowerCase(),
        isCustom: false,
      },
    });

    if (!exists) {
      // 2. CREATE (if new)
      await prisma.exercise.create({
        data: {
          name: ex.name,
          primaryMuscle: ex.primaryMuscle.toLowerCase(),
          secondaryMuscles: ex.secondaryMuscles ?? [],
          equipment: ex.equipment.toLowerCase(),
          imageUrl: ex.imageUrl ?? null,

          // 👇 THIS WAS MISSING!
          howToSteps: ex.howToSteps ?? [],

          isCustom: false,
          createdByUserId: null,
        },
      });
      console.log(`✨ Created: ${ex.name}`);
    } else {
      // 3. UPDATE (if exists) - This fixes your empty data!
      await prisma.exercise.update({
        where: { id: exists.id },
        data: {
          howToSteps: ex.howToSteps ?? [], // Inject instructions
          imageUrl: ex.imageUrl ?? null, // Update video links if changed
        },
      });
      process.stdout.write("."); // Small dot to show progress
    }
  }

  console.log("\n✅ Seeding complete & Instructions updated!");
}

main()
  .catch((e) => console.error(e))
  .finally(() => prisma.$disconnect());
