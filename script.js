// Manipulador para os itens do menu principal
document.querySelectorAll('nav ul li').forEach(item => {
    item.addEventListener('click', function() {
        const sectionId = this.getAttribute('data-section');
        const submenuId = this.getAttribute('data-submenu');

        // Mudar seção principal (se houver)
        if (sectionId) {
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(sectionId).classList.add('active');
        }

        // Mudar submenu (se houver)
        if (submenuId) {
            document.querySelectorAll('.submenu-section').forEach(submenu => {
                submenu.classList.remove('active');
            });
            document.getElementById(submenuId).classList.add('active');
        }
    });

    // Manipulador para subitens (ul li ul li)
    item.querySelectorAll('ul li').forEach(subitem => {
        subitem.addEventListener('click', function(event) {
            const sectionId = this.getAttribute('data-section');
            
            // Prevenir a propagação do clique para o item principal
            event.stopPropagation();
            
            // Mudar a seção principal (se houver)
            if (sectionId) {
                document.querySelectorAll('.section').forEach(section => {
                    section.classList.remove('active');
                });
                document.getElementById(sectionId).classList.add('active');
            }
        });
    });
});

const initialDensityInput = document.getElementById('initialDensity_input');
const initialDensityOutput = document.getElementById('initialDensityValue');

    // Função para atualizar o valor do output
    function updateDensityValue() {
        initialDensityOutput.textContent = initialDensityInput.value;
    }

    // Atualizar o valor ao carregar a página
    updateDensityValue();

    // Adicionar evento para atualizar o valor em tempo real
    initialDensityInput.addEventListener('input', updateDensityValue);

    const BiasInput = document.getElementById('Bias_input');
    const BiasOutput = document.getElementById('BiasValue');
    
        // Função para atualizar o valor do output
        function updateBiasValue() {
            BiasOutput.textContent = BiasInput.value;
        }
    
        // Atualizar o valor ao carregar a página
        updateDensityValue();
    
        // Adicionar evento para atualizar o valor em tempo real
        BiasInput.addEventListener('input', updateDensityValue);

        const RateInput = document.getElementById('Rate_input');
        const RateOutput = document.getElementById('RateValue');
        
            // Função para atualizar o valor do output
            function updateRateValue() {
                RateOutput.textContent = RateInput.value;
            }
        
            // Atualizar o valor ao carregar a página
            updateRateValue();
        
            // Adicionar evento para atualizar o valor em tempo real
            RateInput.addEventListener('input', updateRateValue);

const itemForm = document.getElementById('itemForm');
        const itemInput = document.getElementById('itemInput');
        const itemTable = document.getElementById('itemTable').getElementsByTagName('tbody')[0];
        const matrixDiv = document.getElementById('matrix');
        const canvas = document.getElementById('canvas');
        const ctx = canvas.getContext('2d');
        const colorPicker = document.getElementById('colorPicker');
        const divideCheckbox = document.getElementById('divideCheckbox');
        const divisionInput = document.getElementById('divisionInput');

        let items = [];
        let matrixValues = [];
        let positions = [];
        let colors = ['#FF5733', '#33FF57', '#3357FF', '#F33FF5', '#57F5FF', '#F5FF33'];
        let draggingIndex = null;
        let selectedCircleIndex = null;
        const radius = 40;

        function resizeCanvas() {
            canvas.width = window.innerWidth * 0.95;
            canvas.height = window.innerHeight * 0.75;
            drawCirclesAndLines();
        }

        itemForm.addEventListener('submit', function(event) {
            event.preventDefault();
            const newItem = itemInput.value.trim();
            const divisions = parseInt(divisionInput.value) || 0;
            const totalItems = (divisions ? (divisions * 2) : 1);
            const itemColor = colors[items.length % colors.length];

            for (let i = 0; i < totalItems; i++) {
                let itemName = newItem;
                if (totalItems > 1) itemName += ` ${i + 1}`;
                items.push(itemName);
                positions.push({ x: canvas.width / 2, y: canvas.height / 2 });
                matrixValues.push(Array(items.length).fill(0));
                matrixValues.forEach(row => row.push(0));
                addRow(itemName);
            }

            itemInput.value = '';
            divisionInput.value = 0;
            generateMatrix();
        });

        function addRow(item) {
            const row = itemTable.insertRow();
            const cell = row.insertCell(0);
            cell.textContent = item;
        }

        function generateMatrix() {
            matrixDiv.innerHTML = '';
            const matrixTable = document.createElement('table');
            const headerRow = document.createElement('tr');

            headerRow.appendChild(document.createElement('th'));
            items.forEach(item => {
                const th = document.createElement('th');
                th.textContent = item;
                headerRow.appendChild(th);
            });
            matrixTable.appendChild(headerRow);

            items.forEach((rowItem, rowIndex) => {
                const row = document.createElement('tr');
                const th = document.createElement('th');
                th.textContent = rowItem;
                row.appendChild(th);

                items.forEach((colItem, colIndex) => {
                    const input = document.createElement('input');
                    input.type = 'number';
                    input.min = '0';
                    input.max = '1';
                    input.step = '0.01';
                    input.value = matrixValues[rowIndex][colIndex] || 0;
                    input.addEventListener('change', function() {
                        if (parseFloat(input.value) < 0 || parseFloat(input.value) > 1) {
                            alert('Valor deve estar entre 0 e 1.');
                            input.value = 0;
                        }
                        matrixValues[rowIndex][colIndex] = parseFloat(input.value);
                        drawCirclesAndLines();
                    });
                    const td = document.createElement('td');
                    td.appendChild(input);
                    row.appendChild(td);
                });
                matrixTable.appendChild(row);
            });

            matrixDiv.appendChild(matrixTable);
            drawCirclesAndLines();
        }

        function drawCirclesAndLines() {

        ctx.clearRect(0, 0, canvas.width, canvas.height); // Limpa o canvas
        

        items.forEach((item, index) => {
            const { x, y } = positions[index];
            const color = colors[index % colors.length]; // Cor predefinida

            // Desenha o círculo
            ctx.beginPath();
            ctx.arc(x, y, radius, 0, Math.PI * 2);
            ctx.fillStyle = color;
            ctx.fill();
            ctx.closePath();

            // Desenha linhas e valores de correlação
            for (let j = 0; j < items.length; j++) {
                const value = matrixValues[index][j];
                // Desenha a linha apenas se o valor da matriz for maior que 0
                if (value > 0 && value <= 1 && index !== j) { // Verifica se o valor está entre 0 e 1
                    const targetX = positions[j].x;
                    const targetY = positions[j].y;

                    // Calcula os pontos de contato
                    const startX = x; // Começo no centro do círculo
                    const startY = y; // Começo no centro do círculo
                    const endX = targetX - (radius + 10) * Math.cos(Math.atan2(targetY - startY, targetX - startX));
                    const endY = targetY - (radius + 10) * Math.sin(Math.atan2(targetY - startY, targetX - startX));

                    // Calculo para curvar a linha
                    const controlX = (startX + endX) / 2 + Math.sign(targetX - startX) * 80; // Aumentando o espaço da curva
                    const controlY = (startY + endY) / 2;

                    ctx.beginPath();
                    ctx.moveTo(startX, startY);
                    ctx.quadraticCurveTo(controlX, controlY, endX, endY); // Curva
                    ctx.strokeStyle = color; // Cor da linha
                    ctx.lineWidth = 1;
                    ctx.stroke();
                    ctx.closePath();

                    // Adiciona texto do valor no meio da linha
                    const midX = (startX + endX) / 2;
                    const midY = (startY + endY) / 2;
                    ctx.fillStyle = color; // Cor do texto
                    ctx.fillText(value.toFixed(2), midX, midY - 10); // Texto acima do meio da linha
                }
            }

            // Adiciona o nome e o valor da diagonal dentro do círculo
            ctx.fillStyle = '#fff';
            ctx.font = '14px Arial';
            ctx.textAlign = 'center';
            ctx.fillText(item, x, y);
            ctx.fillText(matrixValues[index][index].toFixed(2), x, y + 20); // Valor da diagonal logo abaixo do nome
        });
        }

        canvas.addEventListener('mousedown', function(event) {
            draggingIndex = null;
            positions.forEach((position, index) => {
                const dist = Math.hypot(event.offsetX - (position.x ), event.offsetY - (position.y ));
                if (dist < 40) {
                    draggingIndex = index;
                }
            });
        });

        canvas.addEventListener('mouseup', function() {
            draggingIndex = null;
        });

       canvas.addEventListener('mousemove', function(event) {
            if (draggingIndex !== null) {
                positions[draggingIndex].x = event.offsetX ;
                positions[draggingIndex].y = event.offsetY ;
                drawCirclesAndLines();
            }
        });

        canvas.addEventListener('dblclick', function(event) {
            selectedCircleIndex = null;
            positions.forEach((position, index) => {
                const dist = Math.hypot(event.offsetX - (position.x ), event.offsetY - (position.y ));
                if (dist < 40) {
                    selectedCircleIndex = index;
                    colorPicker.style.left = `${event.pageX}px`;
                    colorPicker.style.top = `${event.pageY}px`;
                    colorPicker.value = colors[selectedCircleIndex];
                    colorPicker.style.display = 'block';
                }
            });
        });

        colorPicker.addEventListener('input', function() {
            if (selectedCircleIndex !== null) {
                colors[selectedCircleIndex] = colorPicker.value;
                drawCirclesAndLines();
            }
        });

        document.addEventListener('click', function(event) {
            if (!event.target.closest('#colorPicker')) {
                colorPicker.style.display = 'none';
            }
        });

        window.addEventListener('load', resizeCanvas);
        window.addEventListener('resize', resizeCanvas);

const instructions = document.getElementById('Instructions');

// Adiciona um evento de clique no canvas para esconder as instruções
canvas.addEventListener('click', function() {
  instructions.style.display = 'none';
});
function ShowInstructions(){
    if(instructions.style.display == 'none'){
        instructions.style.display = 'block'; // Instruções visíveis ao carregar a página
    }
    else{
        instructions.style.display = 'none';
    }
}


const FragmentationCheckBox = document.getElementById('Fragmentation');
const FragmentationParametersDIV = document.getElementById('FragmentationParameters');
 // Adiciona um evento de mudança ao checkbox
 FragmentationCheckBox.addEventListener('change', function() {
    // Verifica se o checkbox está marcado
    if (FragmentationCheckBox.checked) {
        // Muda a classe da div
        FragmentationParametersDIV.className = 'groupInlineElements';
    } else {
        // Restaura a classe original
        FragmentationParametersDIV.className = 'groupInlineElements invisible';
    }
});

const GregariousBehaviorCheckBox = document.getElementById('GregariousBehavior');
const GregariousBehaviorParametersDIV = document.getElementById('GregariousBehaviorParameters');
 // Adiciona um evento de mudança ao checkbox
 GregariousBehaviorCheckBox.addEventListener('change', function() {
    // Verifica se o checkbox está marcado
    if (GregariousBehaviorCheckBox.checked) {
        // Muda a classe da div
        GregariousBehaviorParametersDIV.className = 'groupInlineElements';
    } else {
        // Restaura a classe original
        GregariousBehaviorParametersDIV.className = 'groupInlineElements invisible';
    }
});
const SocialHierarchyCheckBox = document.getElementById('SocialHierarchy');
const SocialHierarchyParametersDIV = document.getElementById('SocialHierarchyParameters');
 // Adiciona um evento de mudança ao checkbox
 SocialHierarchyCheckBox.addEventListener('change', function() {
    // Verifica se o checkbox está marcado
    if (SocialHierarchyCheckBox.checked) {
        // Muda a classe da div
        SocialHierarchyParametersDIV.className = 'groupInlineElements';
    } else {
        // Restaura a classe original
        SocialHierarchyParametersDIV.className = 'groupInlineElements invisible';
    }
});
const ParentalBehaviorCheckBox = document.getElementById('ParentalBehavior');
const ParentalBehaviorParametersDIV = document.getElementById('ParentalBehaviorParameters');
 // Adiciona um evento de mudança ao checkbox
 ParentalBehaviorCheckBox.addEventListener('change', function() {
    // Verifica se o checkbox está marcado
    if (ParentalBehaviorCheckBox.checked) {
        // Muda a classe da div
        ParentalBehaviorParametersDIV.className = 'groupInlineElements';
    } else {
        // Restaura a classe original
        ParentalBehaviorParametersDIV.className = 'groupInlineElements invisible';
    }
});