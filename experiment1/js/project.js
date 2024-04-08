// project.js - how-to book title generator
// Author: Marcus Williamson
// Date: 4/7/2024

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

function main() {
  const fillers = {
    action: ["Survive", "Experience Success With", "Not Die to", "Play", "Cook", "Discover", "Understand", "Approach", "Become", "Not Become", "Escape", "Deal With", "Fight", "Recognize", "Win", "Beat", "Piss Off", "Improve", "Spice Up"],
    thing: ["Your Parents", "Chess", "Fish", "Cattle", "Farming", "School", "Your Life", "Public Speaking", "Meditation"],
    descriptor: ["Ultimate", "Complete", "Essential", "Beginning", "Comprehensive", "Conclusive", "Life-Changing"],
    audience: ["Gamers", "Dummies", "Idiots", "Students", "Nerds", "Programmers", "Artists", "Hitchhikers", "Athletes", "Amateurs", "Farmers", "Magicians", "Mystics", "Moms", "Psychologists", "Pastors", "Warriors", "Musicians", "Teens"],
    topic: ["JavaScript", "Minecraft", "Carpentry", "Cattle", "Fishing", "the Galaxy", "Public Speaking", "Meditation", "Mushrooms", "Drugs"]
  };
  
  const template = `How To $action $thing: The $descriptor Guide to $topic for $audience`;
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }

    $("#box").text(story);
  }

  $("#clicker").click(generate);
  
  generate();
  
}

// let's get this party started - uncomment me
main();
