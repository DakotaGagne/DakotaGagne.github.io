$(document).ready(() => {
    render_projects('featured');
})


let render_projects = (slug) => {
    let projects_area = $('.projects-wrapper');

    $('.white-button').removeClass('white-button-hover');
    $(`#${slug}`).addClass('white-button-hover');

    let projects_obj = [
        {
            image: 'ADD IMAGE',
            link: 'ADD LINK',
            title: 'Solitaire',
            demo: 'ADD DEMO',
            technologies: ['Python', 'Pygame'],
            description: "Solitaire Game made with Pygame. It has a simple GUI and is easy to play. Has Klondike, Spider, and FreeCell.",
            categories: ['featured', 'python']
        },
        {
            image: '/assets/images/TetrisJS.jpg',
            link: 'https://github.com/DakotaGagne/Tetris-JS',
            title: 'Tetris JS',
            demo: 'http://www.dakotagagne.ca/projects/tetris-js/',
            technologies: ['HTML', 'JS', "CSS"],
            description: "A Tetris Clone made to be as similar to the original game as possible. Has an option to add custom made shapes to the game.",
            categories: ['featured', 'javascript']
        },
        {
            image: '/assets/images/Pong-NN.jpg',
            link: 'https://github.com/DakotaGagne/Pong-NN/',
            title: 'Pong NN',
            technologies: ['PY', 'TK', 'NN', 'Genetic Alg'],
            description: "Neural Network made to be trained to play Pong. Uses Genetic Algorithms to train the Neural Network. Has one program to train the NN, and another to play against it.",
            categories: ['featured', 'python']
        },
        {
            image: 'ADD IMAGE',
            link: 'ADD LINK',
            title: 'E Sports Scheduler',
            demo: 'ADD DEMO',
            technologies: ['Python'],
            description: "Scheduler designed for E Hockey and Fifa Tournaments. Makes the schdules based on a number of factors, including distribution of games, duplicate prevention, and even home and away matches.",
            categories: ['python']
        },
        {
            image: 'ADD IMAGE',
            link: 'ADD LINK',
            title: 'Shooter Game',
            demo: 'ADD DEMO',
            technologies: ['HTML', 'CSS', "JS", "AI"],
            description: "Top Down Shooter Game, featuring ai opponents, scoreboard, skills, and more.",
            categories: ['javascript']
        },
        
        {
            image: 'ADD IMAGE',
            link: 'ADD LINK',
            title: 'Chess JS',
            demo: 'ADD DEMO',
            technologies: ['HTML', 'CSS', "JS"],
            description: "Chess Game made with JS. Includes an AI to play against",
            categories: ['javascript']
        },
    ]

    let projects = [];
    if(slug == 'all') {
        projects = projects_obj.map(project_mapper);
    } 
    else {
        projects = projects_obj.filter(project => project.categories.includes(slug)).map(project_mapper);
    }
    projects_area.hide().html(projects).fadeIn();
}

let project_mapper = project => {
    return `
        <div class="wrapper">
                
            <div class="card radius shadowDepth1">

                ${project.image ? 
                    `<div class="card__image border-tlr-radius">
                        <a href="${project.link}">
                            <img src="${project.image}" alt="image" id="project-image" class="border-tlr-radius">
                        </a>
                    </div>`           
                : ''}

        
                <div class="card__content card__padding">
        
                    <article class="card__article">
                        <h2><a href="${project.link}">${project.title}</a></h2>
        
                        <p class="paragraph-text-normal">${project.description} ${project.demo ? `<a href="${project.demo}" style = "color: blue">SEE DEMO</a>` : ''}</p>
                    </article>
 
                                
                    <div class="card__meta">
                        ${project.technologies.map(tech =>
                            `<span class="project-technology paragraph-text-normal">${tech}</span>`
                        ).join('')}
                    </div>

                </div>
            </div>
        </div>
    `
}

let selected = (slug) => {
    render_projects(slug);
}