# RunDiary

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.1.3.

<!-- ## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files. -->

# **_RunDiary_**

RunDiary is a web application where users can track their running progress towards a chosen destination from their home location. By logging runs, users can see the distance they've covered and how much further they need to go to reach their goal. It's a motivating way to visualize your running progress!

This project is my introduction to working with Angular and has been a collaborative effort with Luke, who had the initial idea and set up the foundation. From there, I took over, developing most of the app's logic and functionality.

# Contents

- [**Features**](#features)
  - [**Existing Features**](#existing-features)
    - [Initial Form Screen](#initial-form-screen)
    - [Dropdown Menu](#dropdown-menu)
    - [User Information](#user-information)
    - [Add Goal](#add-goal)
- [**Technologies Used**](#technologies-used)

[Back to top](#contents)

# Features

RunDiary

## Existing Features

- ### Initial Form Screen

  - If no data is detected in local storage, the user will be shown an inital form screen, where they are asked to enter a username, and choose their home location, before being directed to the main screen.

  <!-- <Initial form image> -->

  ### Dropdown Menu

  - This dropdown menu has a number of feature. Firstly the user can change between Kilometers or Miles based on their preference. This dynamically updates all numbers to a decimal place of 2.

  - User can also set their running stats back to 0. This is useful if a user wants to start reset the distance they have ran so far, without deleting all the goals they have completed so far.

  - Lastly users have the option to reset everything. This will wipe all the users information and reload the page to the initial form screen.

  <!-- <Dropdown menu image>   -->

  ### User Information

  - The users information is displayed at the top of the screen with their current running stats. The user is able to click on their username and change it at anytime.

  <!-- <User info image> -->

  ### Add Goal

  - Users can enter a location and choose from a list which they want to add as a goal. The users current total distance ran will then be used to calculate how much farther they have until they reach that goal.

  <!-- <Add Goal image>  -->

[Back to top](#contents)

# Technologies Used

- [HTML5](https://html.spec.whatwg.org/) - provides the content and structure for the website.
- [TypeScript](https://www.typescriptlang.org/) - used to write all the projects logic.
- [Angular](https://angular.dev/) - javascript framework, used for linking logic to html. The backbone of the website.
- [LESS](https://lesscss.org/) - CSS language extention - used for styling.
- [Material UI](https://mui.com/material-ui/) - used for component templates for faster and more cohesive design elements.
- [Local Storage](https://developer.mozilla.org/en-US/docs/Web/API/Window/localStorage) - all users information and running data is stored in local storage.
- [Git](https://git-scm.com/) - used for version control
- [Github](https://github.com/) - used to host and edit the website.
- [VSCode](https://code.visualstudio.com/) - Used for writing all the websites code.

[Back to top](#contents)
