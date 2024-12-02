$(document).ready(() => {
    render_projects('featured');
})


let render_projects = (slug) => {
    let projects_area = $('.projects-wrapper');

    $('.white-button').removeClass('white-button-hover');
    $(`#${slug}`).addClass('white-button-hover');

    let projects_obj = [
        {
            image: '/assets/images/Blogtech-Node.jpg',
            link: 'https://github.com/DakotaGagne/Blogtech',
            title: 'Blog Website',
            demo: 'https://www.blogtech-v1.glitch.me/',
            technologies: ["Node", "Express", "EJS", "Bootstrap", 'HTML', 'CSS', "JS"],
            description: "Multi page dynamic blog site made with Node and Express. Will dynamically load the most recent posts in order, and can filter by category. Features ability to create new posts, and have them update the blog pages.",
            categories: ['javascript', 'featured']
        },
        {
            image: '/assets/images/Solitaire-PY.jpg',
            link: 'https://github.com/DakotaGagne/Solitaire-PY',
            title: 'Solitaire Game',
            demo: 'https://dakotagagne.itch.io/solitaire',
            technologies: ['Python', 'Pygame'],
            description: "Solitaire Game made with Pygame. It has a simple GUI and is easy to play. Has Klondike, Spider, and FreeCell. Still a work in progress but has been a great application of my OOP skills, and reusability in code. Demo is available but better played downloading from Github",
            categories: ['featured', 'python']
        },
        {
            image: '/assets/images/TetrisJS.jpg',
            link: 'https://github.com/DakotaGagne/Tetris-JS',
            title: 'Tetris Game',
            demo: 'http://www.dakotagagne.ca/projects/tetris-js/',
            technologies: ['HTML', 'JS', "CSS"],
            description: "A Tetris Clone made to be as similar to the original game as possible. Has an option to add custom made shapes to the game. Full game available as demo.",
            categories: ['featured', 'javascript']
        },
        {
            image: '/assets/images/Pong-NN.jpg',
            link: 'https://github.com/DakotaGagne/Pong-NN/',
            title: 'Pong NN',
            video: '/assets/other/Pong.mp4',
            technologies: ['PY', 'TK', 'NN', 'Genetic Alg'],
            description: "Neural Network made to be trained to play Pong. Uses Genetic Algorithms to train the Neural Network. Has one program to train the NN, and another to play against it. Video available for demonstration of training process.",
            categories: ['python']
        },  
        {
            image: '/assets/images/ESportsScheduler-PY.jpg',
            link: 'https://github.com/DakotaGagne/Esports-Scheduler-Py',
            title: 'E Sports Scheduler',
            example_csv: 'https://www.dakotagagne.ca/assets/other/Reg_Season_Schedule.csv',
            technologies: ['Python'],
            description: "Scheduler designed for E Hockey and Fifa Tournaments. Makes the schedules based on a number of factors, including distribution of games, duplicate prevention, and even home and away matches. Example CSV available for download.",
            categories: ['featured', 'python']
        },
        {
            image: '/assets/images/Shooter-JS.jpg',
            link: 'https://github.com/DakotaGagne/Shooter-JS',
            title: 'Shooter Game',
            demo: 'https://www.dakotagagne.ca/projects/shooter-js/',
            technologies: ['HTML', 'CSS', "JS", "AI"],
            description: "Top Down Shooter Game, featuring AI opponents, scoreboard, skills, and more. Full game available as demo.",
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
    let demo_link = ''
    demo_link = project.video ? `<a href="${project.video}" style = "color: blue">SEE VIDEO</a>` : demo_link
    demo_link = project.example_csv ? `<a href="${project.example_csv}" style = "color: blue">DOWNLOAD EXAMPLE CSV</a>` : demo_link
    demo_link = project.demo ? `<a href="${project.demo}" style = "color: blue">SEE DEMO</a>` : demo_link
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
        
                        <p class="paragraph-text-normal">${project.description} ${demo_link}</p>
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