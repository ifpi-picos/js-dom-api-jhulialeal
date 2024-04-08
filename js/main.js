class TodoList {
    constructor() {
        this.usuario = localStorage.getItem('usuario') || 'jhulialeal';
        this.repositorios = [];
    }

    autenticar(usuario) {
        this.usuario = usuario;

        localStorage.setItem('usuario', usuario);
    }

    async listarRepositorios() {
        const data = await (await fetch(`https://api.github.com/users/${this.usuario}/repos`)).json();

        this.repositorios = data;

        let html = '';
        for (const repo of this.repositorios) {
            html += `<li data-id="${repo.id}" data-name="${repo.name}">${repo.full_name}</li>`;
        }

        document.querySelector('#repositorios .lista').innerHTML = html;

        document.querySelectorAll('#repositorios .lista li')?.forEach((el) => {
            el?.addEventListener('click', (event) => {
                const repositorioAtual = {
                    id: event.currentTarget.getAttribute('data-id'),
                    name: event.currentTarget.getAttribute('data-name'),
                }

                console.log('repositorioAtual', repositorioAtual)

                localStorage.setItem('repositorioAtual', JSON.stringify(repositorioAtual));

                window.location.href = './atividades.html';
            })
        })
    }

    async listaAtividades() {
        const atividades = JSON.parse(localStorage.getItem('atividades')) || [];
        const repositorioAtual = JSON.parse(localStorage.getItem('repositorioAtual'));

        let html = '';
        for (const item of atividades) {
            html += `
                <li data-repo-id="${item.repo.id}" data-name="${item.name}" data-is-done="${item.done}">
                    <span>${item.name}</span>

                    <div class="acoes-lista">
                        <svg class="done" title="Concluir" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>
                        <svg class="remove" title="Remover" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                    </div>
                </li>
            `;
        }

        document.querySelector('#atividades .lista').innerHTML = html;

        document.querySelectorAll('#atividades .lista li').forEach((el, index) => {
            el.querySelector('.remove').addEventListener('click', () => {
                const lista = atividades;

                lista.splice(index, 1);

                localStorage.setItem('atividades', JSON.stringify(lista));

                this.listaAtividades();
            });

            el.querySelector('.done').addEventListener('click', () => {
                const lista = atividades;

                lista[index].done = true;

                localStorage.setItem('atividades', JSON.stringify(lista));

                this.listaAtividades();
            });


            const repoId = el.getAttribute('data-repo-id');

            if (repoId !== repositorioAtual.id) {
                el.classList.add('esconde');
            } else {
                el.classList.remove('esconde');
            }
        });
    }

    adicionarNovaAtividade(event) {
        const atividades = localStorage.getItem('atividades');
        const repositorio = JSON.parse(localStorage.getItem('repositorioAtual')) || {};

        const obj = Array.from(JSON.parse(atividades) || []);

        obj.push({
            name: document.querySelector('input').value,
            done: false,
            repo: {
                id: repositorio.id,
                name: repositorio.name,
            },
        })

        localStorage.setItem('atividades', JSON.stringify(obj));

        this.listaAtividades();
    }
}

const todoList = new TodoList();

const input = document.querySelector('#login input[type=text]')

input?.addEventListener('input', (event) => {
    document.querySelector('main#login img').setAttribute('src', `https://github.com/${event.currentTarget.value}.png`)
    todoList.autenticar(event.currentTarget.value);
})

document.querySelector('main#login form')?.addEventListener('submit', event => {
    event.preventDefault();

    if (todoList.usuario) {
        window.location.href = './repositories.html';
    }
})

document.querySelector('.usuario').innerHTML = todoList.usuario;
document.querySelector('.avatar').setAttribute('src', `https://github.com/${todoList.usuario}.png`);
document.querySelector('.avatar').setAttribute('alt', todoList.usuario);

document.querySelector('.sair')?.addEventListener('click', (event) => {
    event.preventDefault();

    localStorage.removeItem('usuario');

    window.location.href = './index.html';
});

document.addEventListener('DOMContentLoaded', function (event) {
    if (document.querySelector('#repositorios')) {
        todoList.listarRepositorios();
    }

    if (document.querySelector('#atividades')) {
        const repositorioAtual = JSON.parse(localStorage.getItem('repositorioAtual'));

        console.log(repositorioAtual)
        if (repositorioAtual) {
            document.querySelector('#atividades .repositorio').innerHTML = repositorioAtual?.name || '';
        }

        todoList.listaAtividades();
    }

    document.querySelector('#atividades form.nova-atividade').addEventListener('submit', function (event) {
        event.preventDefault();

        todoList.adicionarNovaAtividade();

        document.querySelector('input').value = '';

        return false;
    })
})