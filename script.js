// ======================
// MAPA
// ======================

const map = L.map('map').setView([-7.93, -34.87], 11);

L.tileLayer(
'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
{
    attribution:'© OpenStreetMap'
}
).addTo(map);

// ======================
// ÍCONES
// ======================

const greenIcon = new L.Icon({
    iconUrl:
'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png',

    shadowUrl:
'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',

    iconSize:[25,41],
    iconAnchor:[12,41]
});

const redIcon = new L.Icon({
    iconUrl:
'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',

    shadowUrl:
'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',

    iconSize:[25,41],
    iconAnchor:[12,41]
});

// ======================
// DADOS
// ======================

let imoveis =
JSON.parse(localStorage.getItem("imoveis")) || [

{
    id:1,
    nome:"Mirante das Paineiras",
    cidade:"Igarassu",
    lat:-7.827,
    lng:-34.909,
    disponivel:true
},

{
    id:2,
    nome:"Apartamento Janga",
    cidade:"Paulista",
    lat:-7.932,
    lng:-34.826,
    disponivel:false
}

];

let markers=[];

// ======================
// SALVAR
// ======================

function salvarDados(){

    localStorage.setItem(
        "imoveis",
        JSON.stringify(imoveis)
    );
}

// ======================
// DESENHAR MAPA
// ======================

function atualizarMapa(){

    markers.forEach(m=>{
        map.removeLayer(m);
    });

    markers=[];

    imoveis.forEach(imovel=>{

        const marker = L.marker(
            [imovel.lat, imovel.lng],
            {
                icon:
                imovel.disponivel
                ? greenIcon
                : redIcon
            }
        ).addTo(map);

        marker.bindPopup(`
            <b>${imovel.nome}</b><br>
            ${imovel.cidade}<br>
            ${
                imovel.disponivel
                ? "🟢 Disponível"
                : "🔴 Indisponível"
            }
        `);

        markers.push(marker);
    });

    atualizarLista();
}

// ======================
// ADICIONAR
// ======================

function adicionarImovel(){

    const nome =
    document.getElementById("nome").value;

    const cidade =
    document.getElementById("cidade").value;

    const lat =
    parseFloat(
        document.getElementById("lat").value
    );

    const lng =
    parseFloat(
        document.getElementById("lng").value
    );

    const disponivel =
    document.getElementById("status").value
    === "true";

    if(!nome || !cidade || !lat || !lng){

        alert("Preencha todos os campos");
        return;
    }

    imoveis.push({

        id:Date.now(),

        nome,
        cidade,
        lat,
        lng,
        disponivel
    });

    salvarDados();
    atualizarMapa();

    document.getElementById("nome").value="";
    document.getElementById("cidade").value="";
    document.getElementById("lat").value="";
    document.getElementById("lng").value="";
}

// ======================
// LISTA LATERAL
// ======================

function atualizarLista(){

    let html="";

    imoveis.forEach(imovel=>{

        html += `

        <div class="card">

            <b>${imovel.nome}</b><br>

            ${imovel.cidade}<br>

            ${
                imovel.disponivel
                ? "🟢 Disponível"
                : "🔴 Indisponível"
            }

            <br><br>

            <button
            onclick="localizar(${imovel.lat},${imovel.lng})">
            Ver
            </button>

            <button
            onclick="alterarStatus(${imovel.id})">
            Status
            </button>

            <button
            onclick="removerImovel(${imovel.id})">
            Excluir
            </button>

        </div>
        `;
    });

    document.getElementById(
        "listaImoveis"
    ).innerHTML = html;
}

// ======================
// LOCALIZAR
// ======================

function localizar(lat,lng){

    map.setView([lat,lng],16);
}

// ======================
// STATUS
// ======================

function alterarStatus(id){

    const imovel =
    imoveis.find(i=>i.id===id);

    imovel.disponivel =
    !imovel.disponivel;

    salvarDados();
    atualizarMapa();
}

// ======================
// REMOVER
// ======================

function removerImovel(id){

    if(!confirm("Excluir imóvel?"))
        return;

    imoveis =
    imoveis.filter(
        i=>i.id !== id
    );

    salvarDados();
    atualizarMapa();
}

// ======================
// CLIQUE NO MAPA
// ======================

map.on("click", function(e){

    document.getElementById("lat").value =
    e.latlng.lat.toFixed(6);

    document.getElementById("lng").value =
    e.latlng.lng.toFixed(6);
});

// ======================
// INICIAR
// ======================

atualizarMapa();