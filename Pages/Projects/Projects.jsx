import { useState } from 'react';
import { useLoaderData } from 'react-router-dom';
import Project from './Project';
import './Projects.css';

// eslint-disable-next-line react-refresh/only-export-components
export async function loader() {
    const res = await fetch('http://localhost:8088/pwcAutomationTest/projects');
    const data = await res.json();
    return data;
}

export default function Projects() {
    const loaderData = useLoaderData();
    const [projects,] = useState(loaderData);

    return (
        <>
            <div className='titleContainer'>
                Projects
            </div>
            <div className='projectsContainer'>
                {projects.map(project => <Project key={project.id} title={project.name} id={project.id} />)}
            </div>
        </>
    )
}
