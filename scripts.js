const projectsUrl = '/projects.json';

async function fetchProjects(){
  try{
    const res = await fetch(projectsUrl);
    if(!res.ok) throw new Error('Failed to load');
    return await res.json();
  }catch(e){
    console.error(e);
    return [];
  }
}

function renderProjects(list){
  const container = document.getElementById('projects-list');
  const tpl = document.getElementById('project-template');
  container.innerHTML = '';
  if(!list.length){
    container.textContent = 'No projects found.';
    return;
  }
  list.forEach(p=>{
    const node = tpl.content.cloneNode(true);
    node.querySelector('.project-title').textContent = p.title;
    node.querySelector('.project-desc').textContent = p.description;
    node.querySelector('.tags').textContent = (p.tags||[]).join(' • ');
    const live = node.querySelector('.live-link');
    const src = node.querySelector('.source-link');
    live.href = p.live || '#';
    src.href = p.source || '#';
    container.appendChild(node);
  })
}

function applySearchFilter(projects){
  const q = document.getElementById('search').value.toLowerCase().trim();
  const f = document.getElementById('filter').value;
  return projects.filter(p=>{
    if(f !== 'all' && !(p.tags||[]).includes(f)) return false;
    if(!q) return true;
    return (p.title + ' ' + p.description + ' ' + (p.tags||[]).join(' ')).toLowerCase().includes(q);
  })
}

async function init(){
  const projects = await fetchProjects();
  const filter = document.getElementById('filter');
  const tags = new Set();
  projects.forEach(p=> (p.tags||[]).forEach(t=>tags.add(t)));
  tags.forEach(t=>{const opt=document.createElement('option');opt.value=t;opt.textContent=t;filter.appendChild(opt)});

  const search = document.getElementById('search');
  const render = ()=>renderProjects(applySearchFilter(projects));
  search.addEventListener('input', render);
  filter.addEventListener('change', render);

  document.getElementById('themeToggle').addEventListener('click', ()=>{
    document.documentElement.classList.toggle('light');
  })

  render();
}

init();
