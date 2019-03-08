const login = document.querySelector('#login');
const voting = document.querySelector('#voting');
const candidates = document.querySelector('#candidates');
const selectType = document.querySelector('select');
const loginBtn = document.querySelector('#loginBtn');
const email = document.querySelector('#email');
const password = document.querySelector('#password');
const candidatesTable = document.querySelector('#candidates_table');
const candidate_list = document.querySelector('#candidate_list');
const logoutButton = document.querySelector('#logout');

loginBtn.addEventListener('click', () => {
    if (email.value && password.value) {
        loginUsingCredentials({ email: email.value, password: password.value }, (err, data) => {
            login.style.display = 'none';
            localStorage.setItem('auth_token', data.token);
            if (data && data.type === 'admin') {
                candidates.style.display = 'block';
                displayCandidatesWithVotes();
            } else {
                voting.style.display = 'block';
                displayCandidatesWithHandle();
            }
            logoutButton.style.display = 'block';
        })
    }
})

function onBodyLoad() {
    if (localStorage.getItem('auth_token')) {
        fetchUserData(localStorage.getItem('auth_token'), (err, data) => {
            if (err) {
                localStorage.removeItem('auth_token');
                location.reload();
            } else {
                login.style.display = 'none';
                logoutButton.style.display = 'block';
                if (data.type === 'user') {
                    voting.style.display = 'block';
                    displayCandidatesWithHandle();
                } else {
                    candidates.style.display = 'block';
                    displayCandidatesWithVotes();
                }
            }
        })
    } else {
        login.style.display = 'block';
    }
};

function displayCandidatesWithVotes() {
    getCandidates((err, data) => {
        let str = `<tr>
        <th>Candidate Name</th>
        <th>Candidate Handle</th>
        <th>Votes in favour</th>
        </tr>`
        data.forEach(candidate => {
            str = str + `<tr>
            <td>${candidate.name}</td>
            <td>${candidate.handle}</td>
            <td>${candidate.votesInFavor}</td>
        </tr>`
        });
        candidatesTable.innerHTML = str;
    })
}

function displayCandidatesWithHandle() {
    let str = '';
    getCandidates((err, data) => {
        data.forEach(candidate => {
            str = str + `<div class="radio">
            <label><input type="radio" name="optradio" value="${candidate._id}">${candidate.name} - ${candidate.handle}</label>
        </div>`
        });
        candidate_list.innerHTML = str;
    })
}

function castVote() {
    let radios = document.getElementsByName('optradio');
    radios.forEach(each => {
        if (each.checked) {
            addVote(each.value, (err, data) => {
                if (err) {
                    alert('failed to cast vote');
                } else {
                    alert('Vote added');
                }
            });
        }
    });
}

function addVote(id, callback) {
    fetch(`/candidates/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('auth_token')
        }
    }).then(res => {
        return res.json();
    }).then(data => {
        if (data.status === 404) {
            callback(new Error('Invalid vote'));
        } else {
            callback(null, data);
        }
    }).catch(err => {
        callback(err);
    })
}

function logout() {
    localStorage.removeItem('auth_token');
    location.reload();
}

function fetchUserData(token, callback) {
    fetch(`/users/type/${token}`, {
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(res => {
        return res.json();
    }).then(data => {
        if (data.status === 401) {
            callback(new Error('Unauthorized'));
        } else {
            callback(null, data);
        }
    }).catch(err => {
        callback(err);
    })
}

function loginUsingCredentials(credentials, callback) {
    fetch('/users/login', {
        method: 'POST',
        body: JSON.stringify(credentials),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then((res) => {
        return res.json();
    }).then((data) => {
        callback(null, data)
    }).catch((err) => {
        callback(err);
    });
}

function getCandidates(callback) {
    fetch('/candidates', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
            'authorization': localStorage.getItem('auth_token')
        }
    }).then((res) => {
        return res.json();
    }).then((data) => {
        callback(null, data)
    }).catch((err) => {
        callback(err);
    });
}