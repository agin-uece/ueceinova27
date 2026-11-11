-- =============================================================================
-- SCRIPT DE INSERÇÃO: PORTFÓLIO DE TECNOLOGIAS DA UECE (2025)
-- Banco de Dados: PostgreSQL (inova27)
-- Tabelas afetadas: public.protecoes, public.protecao_tipos
-- Total de registros: 242
--   1. MODELO DE UTILIDADE   :   4 registros (natureza = 'PATENTE',            tipo = 'PATENTE_MODELO_UTILIDADE')
--   2. PROGRAMA DE COMPUTADOR: 110 registros (natureza = 'SOFTWARE',           tipo = 'PROGRAMA_COMPUTADOR')
--   3. DESENHO INDUSTRIAL    :   6 registros (natureza = 'DESENHO_INDUSTRIAL', tipo = 'DESENHO_INDUSTRIAL')
--   4. PATENTE DE INVENÇÃO   : 122 registros (natureza = 'PATENTE',            tipo = 'PATENTE_INVENCAO')
--
-- Observação: Caso ocorra qualquer erro durante a execução, toda a transação
-- será desfeita automaticamente (ROLLBACK implícito do bloco BEGIN..COMMIT).
-- =============================================================================

BEGIN;

-- =============================================================================
-- 1. ABA: MODELO DE UTILIDADE (4 registros)
-- =============================================================================

-- [001/242] MODELO DE UTILIDADE (Linha 2) - BR 10 2022 018032 6 - Curativo autoadesivo para rinomodelação
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Curativo autoadesivo para rinomodelação',
        'Patente de modelo de utilidade (mu) de material na área de biotecnologia, indústria de transformação, setor de fabricação de materiais para uso em medicina, tem por objetivo um modelo de adesivo transparente para uso na região nasal, com aplicação especialmente no pósoperatório de procedimentos de rinomodelação, ao qual foi dada original construção, com vistas a melhorar a sua utilização, segurança e eficiência em relação aos similares existentes. Consiste em um dispositivo adesivo maleável em formato e transparência adaptados para o curativo a ser aplicado após a infiltração de implantes injetáveis no nariz, caracterizado pelo formato fusiforme, com a porção distal ligeiramente alongada em formato triangular e mais curta que a porção proximal, com um orifício, presente na metade distal. O material deve ser translúcido, para possibilitar a visualização da cor da pele facilmente.',
        'UECE',
        'PATENTE',
        '2022-09-09'::date,
        'Imagem: https://mcusercontent.com/808276a99879771b7643dda3e/images/ef6283f7-e677-8067-390c-d7d408e9576e.jpeg',
        NULL, NULL, NULL,
        NULL,
        ARRAY['Fabiano Nadson Magacho Vieira', 'José Henrique Leal Cardoso']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Essa nova forma de construção de curativo autoadesivo propõe-se a facilitar a imobilização rápida e adequada de ponta e da columela nasais, aliviando ainda as forças de compressão sobre o preenchedor injetado na ponta nasal, ao mesmo tempo que permite ao médico e ao paciente acompanharem as possíveis alterações na cor da pele que podem sugerir complicações no pós-procedimento.',
        'BR 10 2022 018032 6',
        'BR 10 2022 018032 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2022 018032 6'
          AND p.nome = 'Curativo autoadesivo para rinomodelação'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_MODELO_UTILIDADE' FROM nova_protecao;

-- [002/242] MODELO DE UTILIDADE (Linha 3) - BR 20 2017 011451 7 - Dispositivo biotecnológico para correção postural
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Dispositivo biotecnológico para correção postural',
        'O presente modelo de utilidade refere-se a um dispositivo para correção postural composto de uma camisa confeccionada com sensores infravermelhos associados a um micro controlador que lê todos os movimentos da coluna vertebral do usuário e determina se aposição em que o usuário se encontra no momento é prejudicial à sua saúde.',
        'UECE',
        'PATENTE',
        '2017-05-31'::date,
        'Imagem: https://mcusercontent.com/808276a99879771b7643dda3e/images/1b787503-8688-25d1-8c97-243ae45223a9.jpeg',
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['denilson de Queiroz Cerdeira', 'José Ferreira Nunes', 'Cássio Pinheiro de Oliveira', 'Jessica de Alencar Bandeira', 'Afonso Barbosa de Souza Neto', 'Ana Paula dos Santos Dantas', 'Victor Hugo Costa de Albuquerque', 'Cristiane Clemente de Mello Salgueiro']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Baseando-se em períodos de tempo e posicionamentos da coluna os dispositivos irão enviar avisos ao usuário (vibrações),lembrando-o de corrigir a própria postura. desta forma o usuário adquirirá o hábito de permanecer com a coluna vertebral em posição confortável e ereta. O dispositivo biotecnológico para correção postural apresenta-se então como uma inovação tecnológica que visa auxiliar o tratamento das alterações posturais.',
        'BR 20 2017 011451 7',
        'BR 20 2017 011451 7',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 20 2017 011451 7'
          AND p.nome = 'Dispositivo biotecnológico para correção postural'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_MODELO_UTILIDADE' FROM nova_protecao;

-- [003/242] MODELO DE UTILIDADE (Linha 4) - Mu 9101252-0 - Recipiente para biópsias
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Recipiente para biópsias',
        'O presente modelo de utilidade descreve um recipiente para biópsias.',
        'UECE',
        'PATENTE',
        '2011-06-02'::date,
        'Imagem: https://mcusercontent.com/808276a99879771b7643dda3e/images/7c08aee0-8c64-8537-efd9-97b3bfa857d7.jpeg',
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Benedito Neilson Rolim', 'Nélio Batista de Morais']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Em especial, o presente modelo de utilidade descreve um recipiente de biópsias com borda de segurança para evitar que o conteúdo do recipiente seja derramado.',
        'Mu 9101252-0',
        'Mu 9101252-0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'Mu 9101252-0'
          AND p.nome = 'Recipiente para biópsias'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_MODELO_UTILIDADE' FROM nova_protecao;

-- [004/242] MODELO DE UTILIDADE (Linha 5) - MU 8701998-1 - Equipamento que permite avaliar perfil de liberação in vitro de sistem
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Equipamento que permite avaliar perfil de liberação in vitro de sistemas de liberação controlada',
        'Compreendido por: sistema controlador automático de rotação, tempo e altura , coluna de sustentação com altura regulável , base da coluna de sustentação do sistema controlador automático , hastes , cestas cilíndricas, tampa superior das cestas cilíndricas, tampa inferior das cestas cilíndricas , display do sistema controlador automático, painel de controle do sistema controlador automático , botão on/off do sistema controlador automático, banho térmico , orificio de entrada de água do banho térmico, orificio de saída de água do banho térmico, placa perfurada interna removível do banho térmico, suporte para acomodar cubas , cubas , tampas individuais das cubas, orificio central das tampas da cubas, orificio lateral da tampa das cubas com capuz de borracha, display do banho térmico, painel de controle do banho térmico, botão on/off do banho térmico e luz indicativa de ligamento do banho térmico , cujo desenvolvimento visa tornar as análises de cinética de liberação in vitro de sistemas de liberação controla mais práticas, eficientes, versáteis e reprodutíveis.',
        'UECE',
        'PATENTE',
        '2007-10-02'::date,
        'Imagem: https://mcusercontent.com/808276a99879771b7643dda3e/images/a3c02b0c-45c1-0984-e8b2-721bb1ec36e8.jpeg',
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Marcilia Pinheiro Da Costa', 'Diana Magalhães de Oliveira']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A tecnologia permite com que não ocorra perdas da formulação e erros na quantificação de fármaco liberado no decorrer do tempo.',
        'MU 8701998-1',
        'MU 8701998-1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'MU 8701998-1'
          AND p.nome = 'Equipamento que permite avaliar perfil de liberação in vitro de sistemas de liberação controlada'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_MODELO_UTILIDADE' FROM nova_protecao;

-- =============================================================================
-- 2. ABA: PROGRAMA DE COMPUTADOR (110 registros)
-- =============================================================================

-- [005/242] PROGRAMA DE COMPUTADOR (Linha 2) - BR 51 2025 005950 7 - ATGK: Algoritmo da Tropa dos Gorilas integrado com K-anonimato
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'ATGK: Algoritmo da Tropa dos Gorilas integrado com K-anonimato',
        'O ATGK é um algoritmo híbrido que combina o Algoritmo de Otimização dos Gorilas (GOA) com clustering fuzzy para anonimização de dados sensíveis, preservando a privacidade conforme LGPD/GDPR sem comprometer o desempenho de modelos de IA. O GOA explora o espaço de soluções simulando o comportamento social dos gorilas para definir centros de cluster, enquanto o clustering fuzzy atribui registros aos clusters garantindo k-anonimidade. A métrica NCP avalia a perda de informação e orienta a otimização até a convergência na melhor solução.',
        'UECE',
        'SOFTWARE',
        '2025-11-19'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['IVO AGUIAR PIMENTA', 'RAFAEL LOPES GOMES']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O ATGK se diferencia por integrar GOA e clustering fuzzy, garantindo k-anonimidade com mínima perda de informação, preservando a utilidade dos dados para IA. Seu ciclo de feedback adaptativo entre GOA e NCP permite otimização contínua, lidando simultaneamente com dados numéricos e categóricos de forma flexível e eficiente.',
        'BR 51 2025 005950 7',
        'BR 51 2025 005950 7',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2025 005950 7'
          AND p.nome = 'ATGK: Algoritmo da Tropa dos Gorilas integrado com K-anonimato'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [006/242] PROGRAMA DE COMPUTADOR (Linha 3) - BR 51 2025 005606 0 - Cats and Bits: Um jogo sobre Gatos e Circuitos Lógicos
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Cats and Bits: Um jogo sobre Gatos e Circuitos Lógicos',
        'A tecnologia é uma aplicação de entretenimento e educação que facilita o aprendizado sobre Organização Computacional usando gamificação e elementos lúdicos de jogos. Possui personagens únicos, história interativa, mecânicas dinâmicas e desafios que ensinam conceitos como portas lógicas, tabelas verdade e sistemas de baixo nível, funcionando offline como um programa de computador.',
        'UECE',
        'SOFTWARE',
        '2025-11-04'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['GLENDA MARA DA SILVA PEREIRA', 'ISMAEL SOUSA FONTELES DE CASTRO', 'ISMAYLE DE SOUSA SANTOS', 'JOABE LIMA RODRIGUES', 'MARINA CARVALHO MOREIRA DE SANTANA', 'VICTOR DE ALMEIDA REINALDO']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A tecnologia se diferencia por unir aprendizado prático e diversão em uma mesma plataforma, equilibrando educação e entretenimento. Permite acesso offline, oferece conteúdo lúdico estruturado com desafios pedagógicos, e apresenta uma abordagem interativa superior a métodos tradicionais de ensino, tornando o aprendizado mais envolvente e eficiente.',
        'BR 51 2025 005606 0',
        'BR 51 2025 005606 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2025 005606 0'
          AND p.nome = 'Cats and Bits: Um jogo sobre Gatos e Circuitos Lógicos'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [007/242] PROGRAMA DE COMPUTADOR (Linha 4) - BR 51 2025 005277 4 - É Seu!
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'É Seu!',
        'Trata-se de um sistema mobile de pedidos e entregas de alimentos voltado para ambientes universitários, permitindo que alunos, professores e servidores façam pedidos em restaurantes internos e recebam as refeições de forma rápida e prática, agilizando o acesso a alimentos dentro do campus.',
        'UECE',
        'SOFTWARE',
        '2025-10-21'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['GABRYELLA SANTOS RODRIGUES', 'KALIL HENRIQUE MOREIRA RODRIGUES', 'LUCAS SILVA HOLANDA', 'LUIS GUSTAVO BARBOSA BENEVIDES', 'MATHEUS HENRIQUE ESTEVES PAIXÃO']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A tecnologia se diferencia por atender exclusivamente ambientes internos como universidades, integrando pedidos e entregas de forma ágil e prática, oferecendo conveniência e rapidez que soluções tradicionais de delivery externas não proporcionam, com potencial de expansão para outros espaços fechados de grande circulação.',
        'BR 51 2025 005277 4',
        'BR 51 2025 005277 4',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2025 005277 4'
          AND p.nome = 'É Seu!'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [008/242] PROGRAMA DE COMPUTADOR (Linha 5) - BR 51 2025 003520 9 - RHEMCE : Registro de Onco-hematologia Cearense
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'RHEMCE : Registro de Onco-hematologia Cearense',
        'O portal é uma ferramenta em nuvem para coleta e gestão de dados de pacientes onco-hematológicos em tempo real, permitindo acompanhamento dos desfechos, padronização das informações e integração com sistemas de análise de dados para apoiar decisões terapêuticas.',
        'UECE',
        'SOFTWARE',
        '2025-07-29'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['CYBELLE FAÇANHA BARRETO MEDEIROS LINARD', 'PAULO HENRIQUE SILVA RODRIGUES']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A tecnologia se diferencia por oferecer coleta estruturada e padronizada de dados onco-hematológicos em tempo real, possibilitando comparação entre serviços, monitoramento de desfechos e suporte à tomada de decisão clínica de forma eficiente e baseada em evidências.',
        'BR 51 2025 003520 9',
        'BR 51 2025 003520 9',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2025 003520 9'
          AND p.nome = 'RHEMCE : Registro de Onco-hematologia Cearense'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [009/242] PROGRAMA DE COMPUTADOR (Linha 6) - BR 51 2025 003513 6 - Code Realms
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Code Realms',
        'O jogo é um RPG educativo que ensina conceitos de dívida técnica e processos de testes de software por meio de desafios interativos e ambiente lúdico, reforçando a aprendizagem de estudantes e interessados em tecnologia.',
        'UECE',
        'SOFTWARE',
        '2025-07-28'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['ISMAYLE DE SOUSA SANTOS', 'PEDRO ULISSES PEREIRA CASTRO MAIA', 'SAMUEL CRISTHIAN ALCÂNTARA DE OLIVEIRA']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A tecnologia se diferencia por combinar aprendizado de testes de software e dívida técnica com gamificação, tornando o ensino mais envolvente e prático em comparação com métodos tradicionais.',
        'BR 51 2025 003513 6',
        'BR 51 2025 003513 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2025 003513 6'
          AND p.nome = 'Code Realms'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [010/242] PROGRAMA DE COMPUTADOR (Linha 7) - BR 51 2025 003509 8 - DOM-Heal: Biblioteca de Self-Healing Genérica para Testes Automatizado
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'DOM-Heal: Biblioteca de Self-Healing Genérica para Testes Automatizados Web',
        'Desenvolvida para automatizar a autocorreção de seletores em testes de aplicações web, permite lidar com quebras causadas por mudanças no DOM, integrando-se a diferentes frameworks e reduzindo o esforço de manutenção, aumentando a robustez e eficiência nos processos de qualidade de software.',
        'UECE',
        'SOFTWARE',
        '2025-07-28'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['ISMAYLE DE SOUSA SANTOS', 'JONNAS CHRISTIAN SOUSA DE PAIVA']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A tecnologia se diferencia por automatizar a adaptação de seletores em testes web de forma genérica, reduzindo falhas e manutenção manual, garantindo maior confiabilidade e produtividade para equipes de QA.',
        'BR 51 2025 003509 8',
        'BR 51 2025 003509 8',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2025 003509 8'
          AND p.nome = 'DOM-Heal: Biblioteca de Self-Healing Genérica para Testes Automatizados Web'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [011/242] PROGRAMA DE COMPUTADOR (Linha 8) - BR 51 2025 003507 1 - Git Flow Quest
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Git Flow Quest',
        'A tecnologia ensina versionamento de código com Git integrando comandos reais a um jogo de plataforma 2D, permitindo que o usuário aprenda de forma lúdica e prática ao avançar em desafios e fases interativas.',
        'UECE',
        'SOFTWARE',
        '2025-07-28'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['ISMAYLE DE SOUSA SANTOS', 'WOSLEY MENDES ROCHA']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Une aprendizagem prática de Git e Git Flow com mecânicas de jogos de plataforma, oferecendo ensino envolvente e integrado à narrativa, com abstrações que facilitam a experiência de aprendizado.',
        'BR 51 2025 003507 1',
        'BR 51 2025 003507 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2025 003507 1'
          AND p.nome = 'Git Flow Quest'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [012/242] PROGRAMA DE COMPUTADOR (Linha 9) - BR 51 2025 003505 5 - KGBoard
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'KGBoard',
        'Jogo educativo desenvolvido com a engine Godot usando GDScript, voltado ao ensino de engenharia de software e testes de software. Apresenta cenários simples e perguntas e respostas que permitem aprendizado interativo, sendo compatível com Windows e totalmente jogável offline, sem necessidade de conexão à internet.',
        'UECE',
        'SOFTWARE',
        '2025-07-28'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['ISMAYLE DE SOUSA SANTOS', 'ITALO VICENTE OLIVEIRA UCHÔA', 'LARA LOPES GARCIA', 'PEDRO HENRIQUE ROCHA DOS SANTOS NONATO', 'SILVIO GONÇALVES XAVIER JÚNIOR']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Integra conceitos de engenharia de software e testes em uma experiência lúdica acessível a alunos do ensino fundamental, combinando gameplay simples com aprendizado prático, promovendo maior engajamento e retenção de conteúdo em comparação a métodos tradicionais.',
        'BR 51 2025 003505 5',
        'BR 51 2025 003505 5',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2025 003505 5'
          AND p.nome = 'KGBoard'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [013/242] PROGRAMA DE COMPUTADOR (Linha 10) - BR 51 2025 003466 0 - VEst: Estimativa de Vazão de Rede
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'VEst: Estimativa de Vazão de Rede',
        'Solução para estimativa indireta da vazão de rede que utiliza medições complementares, como atraso e informações de roteamento (traceroute), para calcular a capacidade de transmissão entre pontos da rede sem necessidade de medições diretas, reduzindo custos e impacto na Qualidade de Serviço (QoS) e Experiência do Usuário (QoE). Permite monitoramento contínuo, detecção de falhas e planejamento de recursos de forma eficiente, aplicável a ISPs, operadoras de backbone e centros de pesquisa.',
        'UECE',
        'SOFTWARE',
        '2025-07-24'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['MARIA CLARA MESQUITA MOURA FERREIRA', 'MARIA DE LOURDES MELO LINHARES DE BRITO', 'RAFAEL LOPES GOMES']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Permite estimar a vazão de rede de forma indireta, eficiente e de baixo impacto, reduzindo custos operacionais e riscos de degradação de QoS/QoE, oferecendo monitoramento contínuo e suporte aprimorado à gestão e planejamento de redes em comparação a medições diretas tradicionais.',
        'BR 51 2025 003466 0',
        'BR 51 2025 003466 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2025 003466 0'
          AND p.nome = 'VEst: Estimativa de Vazão de Rede'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [014/242] PROGRAMA DE COMPUTADOR (Linha 11) - BR 51 2025 003465 2 - TPM-BUNKER: Armazenamento Remoto de Dados Criptografados com TPM
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'TPM-BUNKER: Armazenamento Remoto de Dados Criptografados com TPM',
        'Tecnologia para armazenamento seguro de dados que integra Trusted Platform Module (TPM) com criptografia simétrica (AES-CBC) e assimétrica (RSA), garantindo proteção de informações sensíveis. Utiliza o TPM como raiz de confiança para gerenciamento seguro de chaves, isolando-as de ameaças de software, e autenticação baseada no identificador único do dispositivo para controlar o acesso. Aplicável a setores financeiro, governamental e corporativo, atendendo a padrões de conformidade como LGPD e GDPR.',
        'UECE',
        'SOFTWARE',
        '2025-07-24'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['RAFAEL DE ALMEIDA MENEZES', 'RAFAEL LOPES GOMES']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Oferece proteção robusta de dados críticos combinando TPM e criptografia avançada, fortalecendo integridade e autenticidade das informações, com isolamento de chaves de ameaças de software, controle de acesso seguro e conformidade regulatória superior às soluções tradicionais de armazenamento.',
        'BR 51 2025 003465 2',
        'BR 51 2025 003465 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2025 003465 2'
          AND p.nome = 'TPM-BUNKER: Armazenamento Remoto de Dados Criptografados com TPM'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [015/242] PROGRAMA DE COMPUTADOR (Linha 12) - BR 51 2025 003463 6 - FABR: Firewall Automatizado Baseado em Reputação
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'FABR: Firewall Automatizado Baseado em Reputação',
        'Sistema de segurança da informação que monitora conexões de rede e aplica bloqueios ou degradações automatizadas com base em dados de reputação de IP, oferecendo resposta rápida a ameaças externas. A solução é leve, escalável, de fácil integração e utiliza inteligência de ameaças pública para automação em tempo real, sem depender de soluções proprietárias, atendendo instituições públicas, acadêmicas e pequenas organizações.',
        'UECE',
        'SOFTWARE',
        '2025-07-24'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['MARCUS ANTONIO DE SOUZA COSTA', 'RAFAEL LOPES GOMES']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A tecnologia automatiza a resposta a ameaças de rede em tempo real, reduzindo intervenção manual e custos operacionais, combinando escalabilidade, integração fácil e uso de inteligência de ameaças pública, proporcionando proteção eficiente mesmo em ambientes institucionais menores',
        'BR 51 2025 003463 6',
        'BR 51 2025 003463 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2025 003463 6'
          AND p.nome = 'FABR: Firewall Automatizado Baseado em Reputação'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [016/242] PROGRAMA DE COMPUTADOR (Linha 13) - BR 51 2025 002924 1 - Assistente ACS - Agente comunitário de Saúde
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Assistente ACS - Agente comunitário de Saúde',
        'A tecnologia consiste em um aplicativo móvel para apoio a agentes comunitários de saúde na coleta e gerenciamento de dados alimentares da população assistida. A solução utiliza arquitetura cliente-servidor, com interface responsiva desenvolvida em React, integração via API RESTful em Node.js e armazenamento de dados em banco relacional PostgreSQL. O sistema permite a aplicação digital da Escala de Yale, garantindo coleta padronizada, segurança da informação e possibilidade de expansão para outras ferramentas de triagem em saúde.',
        'UECE',
        'SOFTWARE',
        '2025-07-03'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['HAROLDO FALCÃO RAMOS DA CUNHA', 'HENRIQUE JORGE MAIA COSTA']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A tecnologia baseia-se em conceitos de mHealth, engenharia de software e saúde digital, utilizando frameworks consolidados como React e Node.js, arquitetura RESTful e banco de dados PostgreSQL. Adota boas práticas de interoperabilidade, escalabilidade e proteção de dados, alinhando-se a diretrizes contemporâneas de eHealth e aos princípios de privacy by design.',
        'BR 51 2025 002924 1',
        'BR 51 2025 002924 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2025 002924 1'
          AND p.nome = 'Assistente ACS - Agente comunitário de Saúde'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [017/242] PROGRAMA DE COMPUTADOR (Linha 14) - BR 51 2025 002457 6 - Só mais um teste
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Só mais um teste',
        'A tecnologia consiste em um jogo digital do gênero RPG educativo, desenvolvido para apoiar o ensino de conceitos e práticas de testes de software. O jogo utiliza mecânicas de gamificação, narrativa interativa e desafios progressivos para simular situações reais do processo de testes, promovendo a aprendizagem ativa e o engajamento de estudantes e interessados na área de tecnologia.',
        'UECE',
        'SOFTWARE',
        '2025-06-09'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['IAN JOSÉ SOARES MENDES', 'ISMAYLE DE SOUSA SANTOS', 'JAMILE HELLEN MOTA BARBOSA', 'YAGO MELO DA COSTA', 'YANNE OLIVEIRA ALMEIDA']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O desenvolvimento do jogo baseia-se em referenciais de gamificação aplicada à educação, aprendizagem baseada em jogos digitais (Game-Based Learning) e ensino de engenharia de software. A proposta está alinhada a práticas educacionais que utilizam jogos como ferramenta pedagógica para facilitar a compreensão de conceitos técnicos, especialmente no contexto do ensino de testes de software.',
        'BR 51 2025 002457 6',
        'BR 51 2025 002457 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2025 002457 6'
          AND p.nome = 'Só mais um teste'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [018/242] PROGRAMA DE COMPUTADOR (Linha 15) - BR 51 2025 000845 7 - RAN Graph Producer
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'RAN Graph Producer',
        'A tecnologia consiste em uma ferramenta que modela o processo de handover em redes 5G por meio de grafos. A partir dos contornos das redes de acesso gerados pela ferramenta RAN Viewer e de uma rota do dispositivo, o sistema constrói um grafo que representa as possíveis redes e transições (handovers). Cada aresta do grafo possui atributos que descrevem as consequências de cada decisão, permitindo a aplicação de diferentes algoritmos para calcular o melhor caminho, além da visualização gráfica e análise por métricas comparativas.',
        'UECE',
        'SOFTWARE',
        '2025-03-06'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['ANTÔNIO SÉRGIO DE SOUSA VIEIRA', 'DANIEL SUCUPIRA LIMA', 'JOAQUIM CELESTINO JÚNIOR']::varchar[],
        'Fundação Universidade Estadual do Ceará e INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DO CEARÁ',
        'O diferencial da tecnologia está na abordagem preditiva e baseada em grafos para o processo de handover, considerando contornos reais das redes e a rota do dispositivo. A solução permite comparar múltiplos algoritmos e métricas sobre um mesmo modelo, oferecendo uma visão global das decisões de mobilidade. A integração entre modelagem espacial, análise de grafos e visualização interativa torna a ferramenta mais completa e flexível do que abordagens tradicionais de handover em redes 5G.',
        'BR 51 2025 000845 7',
        'BR 51 2025 000845 7',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2025 000845 7'
          AND p.nome = 'RAN Graph Producer'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [019/242] PROGRAMA DE COMPUTADOR (Linha 16) - BR 51 2025 000844 9 - RAN Viewer
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'RAN Viewer',
        'Ferramenta para análise da qualidade de sinal em redes 5G a partir de mapas 2D. A ferramenta recebe como entrada indicadores de qualidade de sinal, como SINR, SIR, SNR, RXPOWER, RSRP e RSRQ, e permite ao usuário definir um valor limite para gerar curvas de contorno que circundam as regiões com intensidade de sinal superior a esse limiar. Diferentes algoritmos geométricos são utilizados para a construção dos polígonos de contorno, com suporte à visualização gráfica interativa.',
        'UECE',
        'SOFTWARE',
        '2025-03-06'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['ANTÔNIO SÉRGIO DE SOUSA VIEIRA', 'DANIEL SUCUPIRA LIMA', 'JOAQUIM CELESTINO JÚNIOR']::varchar[],
        'Fundação Universidade Estadual do Ceará e INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DO CEARÁ',
        'A tecnologia integra a análise de múltiplos indicadores de radiofrequência com a geração automática de contornos espaciais em mapas 2D. A utilização de diferentes algoritmos para a construção dos polígonos permite avaliar distintas abordagens geométricas para a representação da cobertura, proporcionando uma base consistente para estudos de planejamento, visualização e análise da RAN em redes 5G.',
        'BR 51 2025 000844 9',
        'BR 51 2025 000844 9',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2025 000844 9'
          AND p.nome = 'RAN Viewer'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [020/242] PROGRAMA DE COMPUTADOR (Linha 17) - BR 51 2025 000840 6 - TRUSTV
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'TRUSTV',
        'Sistema de reputação para redes veiculares, denominado TRUSTV (Trust System for Vehicles), voltado ao aumento da segurança e da confiabilidade das comunicações V2V e V2I. O sistema utiliza um modelo de reputação misto, fundamentado na teoria dos jogos, para apoiar decisões rápidas de confiança, identificar veículos maliciosos e incentivar comportamentos cooperativos em ambientes veiculares dinâmicos e heterogêneos.',
        'UECE',
        'SOFTWARE',
        '2025-03-06'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['ANA MARIA BARROSO COSTA QUEVEDO', 'JOAQUIM CELESTINO JÚNIOR', 'SAMUEL FAÇANHA CÂMARA']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A solução aplica conceitos da teoria dos jogos à construção de um sistema de reputação adaptado às características específicas das redes veiculares, como mobilidade elevada, comunicação sem fio e necessidade de decisões em tempo real. Essa abordagem permite detectar padrões anômalos de mensagens e aumentar a confiabilidade das informações trocadas, contribuindo para a segurança da comunicação veicular.',
        'BR 51 2025 000840 6',
        'BR 51 2025 000840 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2025 000840 6'
          AND p.nome = 'TRUSTV'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [021/242] PROGRAMA DE COMPUTADOR (Linha 18) - BR 51 2025 000295 5 - SYDVELM
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'SYDVELM',
        'A tecnologia consiste em um método para identificação e classificação do ataque Sybil em redes veiculares, baseado em aprendizado de máquina supervisionado. O método utiliza características dos nós veiculares como entrada e emprega o algoritmo Extreme Learning Machine (ELM), uma especialização de redes neurais artificiais, para detectar comportamentos maliciosos com foco na proteção de redes veiculares e ambientes ITS.',
        'UECE',
        'SOFTWARE',
        '2025-01-27'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['CARLOS HENRIQUE ORIÁ OLIVEIRA QUEVEDO', 'GUSTAVO AUGUSTO LIMA DE CAMPOS', 'JOAQUIM CELESTINO JÚNIOR']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O uso do algoritmo Extreme Learning Machine possibilita a identificação de ataques Sybil em redes veiculares com alta precisão e eficiência computacional. O método reduz a dimensionalidade dos dados, apresenta adaptabilidade a diferentes cenários de redes veiculares e diminui a ocorrência de falsos positivos e falsos negativos, em comparação com técnicas tradicionais de detecção.',
        'BR 51 2025 000295 5',
        'BR 51 2025 000295 5',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2025 000295 5'
          AND p.nome = 'SYDVELM'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [022/242] PROGRAMA DE COMPUTADOR (Linha 19) - BR 51 2025 000156 8 - MIND - Multimodal Integration for Neurodevelopment Diagnosis
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'MIND - Multimodal Integration for Neurodevelopment Diagnosis',
        'Trata-se do desenvolvimento de uma solução de inteligência artificial multimodal para apoio ao diagnóstico do Transtorno do Espectro Autista (TEA). A solução integra a análise de exames de fMRI, utilizando modelos de aprendizado profundo como MLP, CNN e Vision Transformers, com processamento de linguagem natural por meio de modelos de linguagem e LangChain para a geração automática de relatórios médicos.',
        'UECE',
        'SOFTWARE',
        '2025-01-15'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['EVANDRO CARVALHO DE ANDRADE', 'FRANCISCO NAUBER BERNARDO GOIS', 'JOAQUIM CELESTINO JÚNIOR']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A integração entre análise de imagens cerebrais e geração automatizada de relatórios médicos permite maior precisão diagnóstica e redução de etapas manuais. O uso combinado de múltiplos modelos de aprendizado profundo e processamento de linguagem natural possibilita automação do processo de análise clínica, superando limitações de métodos tradicionais baseados em avaliações isoladas.',
        'BR 51 2025 000156 8',
        'BR 51 2025 000156 8',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2025 000156 8'
          AND p.nome = 'MIND - Multimodal Integration for Neurodevelopment Diagnosis'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [023/242] PROGRAMA DE COMPUTADOR (Linha 20) - BR 51 2025 000154 1 - Heimdall Smart Contract
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Heimdall Smart Contract',
        'Ferramenta de software baseada em blockchain que utiliza contratos inteligentes no Hyperledger Fabric para o controle de acesso a dados médicos. O sistema permite que o titular dos dados autorize ou revogue permissões de acesso de forma direta, além de registrar e rastrear acessos e compartilhamentos realizados mediante consentimento válido.',
        'UECE',
        'SOFTWARE',
        '2025-01-15'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['BRUNO LOPES ALCANTARA BATISTA', 'JOAQUIM CELESTINO JÚNIOR']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O uso de contratos inteligentes elimina a necessidade de intermediários confiáveis para a gestão de permissões, garantindo rastreabilidade, transparência e controle pelo próprio titular dos dados. O registro imutável das autorizações e acessos aumenta a segurança e a confiabilidade no compartilhamento de informações médicas.',
        'BR 51 2025 000154 1',
        'BR 51 2025 000154 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2025 000154 1'
          AND p.nome = 'Heimdall Smart Contract'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [024/242] PROGRAMA DE COMPUTADOR (Linha 21) - BR 51 2024 005125 - D-ACO/GA
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'D-ACO/GA',
        'A tecnologia aborda a criação da estratégia D-ACO/GA, uma abordagem bio-inspirada voltada para a seleção de características na detecção de tráfego anômalo em ambientes de Internet das Coisas (IoT). Esta tecnologia combina a Otimização por Colônia de Formigas (ACO) e Algoritmo Genético (GA) para identificar os subconjuntos mais relevantes de dados, otimizando a análise de tráfego e melhorando a precisão na detecção de anomalias.',
        'UECE',
        'SOFTWARE',
        '2024-12-31'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Antonio Helder Gomes Leoncio Júnior', 'Gustavo Augusto Lima de Campos', 'Joaquim Celestino Júnior']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Esta inovação tem aplicação direta na segurança de redes IoT, permitindo uma análise mais eficaz e redução de falsos positivos e negativos, essenciais para ambientes complexos com grande volume de dados."',
        'BR 51 2024 005125',
        'BR 51 2024 005125',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 005125'
          AND p.nome = 'D-ACO/GA'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [025/242] PROGRAMA DE COMPUTADOR (Linha 22) - BR 51 2024 005045 0 - App - Onde está?: uma aventura em língua portuguesa
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'App - Onde está?: uma aventura em língua portuguesa',
        'É um jogo que oferece uma maneira divertida e eficaz de aprender preposições e adquirir vocabulário da língua portuguesa, tornando o processo de aquisição de uma nova língua mais envolvente e menos intimidante para alunos nativos de outras línguas. Dessa forma, este recurso digital visa proporcionar uma experiência de aprendizado interativa e divertida, focando no uso das preposições de lugar e no vocabulário relacionado aos materiais escolares',
        'UECE',
        'SOFTWARE',
        '2024-12-24'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Diogo Rolim Saraiva dos Santos', 'José Peixoto Coelho de Souza', 'Joyce Moura Barbosa', 'Regina Cláudia Pinheiro']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A interface do jogo foi projetada para ser intuitiva e de fácil navegação, com design atraente que representa uma casa e um ambiente universitário típico, onde cada fase apresenta cenários específicos, como o quarto, a biblioteca, a sala de aula, entre outros. Os jogadores devem completar tarefas utilizando as preposições corretas.',
        'BR 51 2024 005045 0',
        'BR 51 2024 005045 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 005045 0'
          AND p.nome = 'App - Onde está?: uma aventura em língua portuguesa'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [026/242] PROGRAMA DE COMPUTADOR (Linha 23) - BR 51 2024 005044 2 - Onde está?: uma aventura em língua portuguesa
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Onde está?: uma aventura em língua portuguesa',
        'O jogo é uma maneira interativa e divertida de aprender preposições de lugar e vocabulário relacionado a materiais escolares, focando em alunos nativos de outras línguas. Ele proporciona uma experiência prática com preposições como ''em'', ''no'', ''na'', ''sobre'' e ''debaixo de'', ajudando na aquisição de habilidades linguísticas essenciais.',
        'UECE',
        'SOFTWARE',
        '2024-12-24'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Diogo Rolim Saraiva dos Santos', 'José Peixoto Coelho de Souza', 'Joyce Moura Barbosa', 'Regina Cláudia Pinheiro']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O jogo se destaca por sua abordagem inovadora
e focada em habilidades e conteúdos específicos, superando as limitações das tecnologias existentes ao oferecer uma
experiência de aprendizado interativa, contextualizada e personalizada para estudantes de português como língua
estrangeira.',
        'BR 51 2024 005044 2',
        'BR 51 2024 005044 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 005044 2'
          AND p.nome = 'Onde está?: uma aventura em língua portuguesa'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [027/242] PROGRAMA DE COMPUTADOR (Linha 24) - BR 51 2024 005043 4 - Aluno King - Windows
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Aluno King - Windows',
        'É um recurso educacional digital desenvolvido para proporcionar uma experiência interativa de aprendizado através de um jogo educativo. O jogo é projetado para o público infantil, especialmente para estudantes do 1° ano. O protagonista, Renato, é um estudante que guia os jogadores em uma jornada lúdica onde eles devem completar tarefas educativas, como a leitura de um trava-língua (O Pintor Português) e a realização de exercícios focados na compreensão fonológica e na estrutura das palavras.',
        'UECE',
        'SOFTWARE',
        '2024-12-24'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Carliene Jorge da Silva', 'Diogo Rolim Saraiva dos Santos', 'José Rogério de Oliveira', 'Regina Cláudia Pinheiro']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O diferencial da tecnologia está na integração da gamificação com o ensino de habilidades linguísticas. O jogo oferece uma experiência interativa que torna o processo de aprendizado mais dinâmico e motivador.',
        'BR 51 2024 005043 4',
        'BR 51 2024 005043 4',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 005043 4'
          AND p.nome = 'Aluno King - Windows'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [028/242] PROGRAMA DE COMPUTADOR (Linha 25) - BR 51 2024 005042 6 - Aluno King - App
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Aluno King - App',
        'É um recurso educacional digital que proporciona aos estudantes uma experiência de aprendizado interativa através de um jogo lúdico. Focado em alunos do 1° ano, o aplicativo apresenta Renato, um estudante que guia os jogadores por desafios divertidos, com o objetivo de conquistar a coroa de "Aluno King".Para avançar, os jogadores devem ler o trava-língua O Pintor Português e completar as sílabas ausentes nas palavras extraídas deste trava-língua em diferentes níveis do jogo.',
        'UECE',
        'SOFTWARE',
        '2024-12-24'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Carliene Jorge da Silva', 'Diogo Rolim Saraiva dos Santos', 'José Rogério de Oliveira', 'Regina Cláudia Pinheiro']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A inovação da tecnologica está na utilização de uma abordagem gamificada para ensinar a língua portuguesa de maneira interativa e envolvente. O jogo desafia os alunos a completarem palavras, praticando sílabas ausentes de um trava-língua, o que estimula o desenvolvimento da percepção fonológica e ortográfica de forma ativa.',
        'BR 51 2024 005042 6',
        'BR 51 2024 005042 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 005042 6'
          AND p.nome = 'Aluno King - App'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [029/242] PROGRAMA DE COMPUTADOR (Linha 26) - BR 51 2024 005040 0 - Aluno King - Linux
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Aluno King - Linux',
        'O jogo convida os alunos a participar de uma atividade lúdica, onde são guiados por Renato, um estudante fictício. A dinâmica do jogo envolve a leitura do trava-língua O Pintor Português, seguida de um desafio de completar as sílabas ausentes nas palavras retiradas do texto. A cada nível completado com sucesso, o jogador desbloqueia uma letra, que, ao fim do jogo, forma a palavra "King".',
        'UECE',
        'SOFTWARE',
        '2024-12-24'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Carliene Jorge da Silva', 'Diogo Rolim Saraiva dos Santos', 'José Rogério de Oliveira', 'Regina Cláudia Pinheiro']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A utilização de um trava-língua como base para os exercícios permite que os alunos aprimorem a percepção fonológica de forma divertida e interativa. O sistema de desbloqueio de letras a cada fase do jogo, que forma a palavra "King" ao final, oferece uma recompensa constante, incentivando o progresso contínuo e mantendo os alunos motivados.',
        'BR 51 2024 005040 0',
        'BR 51 2024 005040 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 005040 0'
          AND p.nome = 'Aluno King - Linux'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [030/242] PROGRAMA DE COMPUTADOR (Linha 27) - BR 51 2024 005023 0 - ResT-For: Modelo de Resiliente para Predição de Vazão de Rede
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'ResT-For: Modelo de Resiliente para Predição de Vazão de Rede',
        'O Serviço de Monitoramento da Rede Ipê (MonIpê) é uma ferramenta da Rede Nacional de Ensino e Pesquisa (RNP) projetada para realizar testes regulares de desempenho do backbone da rede, garantindo a continuidade e qualidade dos serviços oferecidos. No entanto, ao longo de sua execução, o MonIpê pode apresentar falhas de medição, criando lacunas que impactam diretamente o processo de monitoramento. Esta tecnologia propõe o desenvolvimento de uma solução capaz de coletar os dados do MonIpê, identificar falhas nas medições e corrigir essas falhas, garantindo dados consistentes e completos.',
        'UECE',
        'SOFTWARE',
        '2024-12-24'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Francisco Valderlan Jorge Nobre', 'Maria Clara Mesquita Moura Ferreira', 'Rafael Lopes Gomes', 'Silvio Eduardo Sales de Britto Ribeiro']::varchar[],
        'Fundação Universidade Estadual do Ceará e Rede Nacional de Ensino e Pesquisa',
        'A tecnologia integra a coleta de dados em tempo real com a correção automática de falhas, criando uma base de dados robusta para análise preditiva. A utilização dessa tecnologia permite antecipar problemas de desempenho na rede, possibilitando ações preventivas e, portanto, uma gestão mais eficiente e proativa da infraestrutura de rede.',
        'BR 51 2024 005023 0',
        'BR 51 2024 005023 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 005023 0'
          AND p.nome = 'ResT-For: Modelo de Resiliente para Predição de Vazão de Rede'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [031/242] PROGRAMA DE COMPUTADOR (Linha 28) - BR 51 2024 005022 1 - CorrDelay: Correlação de Dados para Identificação de Links com Alto At
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'CorrDelay: Correlação de Dados para Identificação de Links com Alto Atraso',
        'A tecnologia é uma solução inovadora para o gerenciamento de redes, com foco na detecção de gargalos de desempenho em redes complexas, como a da RNP. Utilizando as medições fim-a-fim realizadas pelo PerfSONAR do MonIpê, entre os diversos Pontos de Presença (PoPs) da rede no Brasil, o CorrDelay realiza uma análise detalhada do tráfego de dados entre esses PoPs. A ferramenta é capaz de identificar problemas de desempenho, como congestionamentos e gargalos na rede, proporcionando uma visão mais clara e precisa da saúde da infraestrutura.',
        'UECE',
        'SOFTWARE',
        '2024-12-24'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Danielle dos Santos Silva', 'Francisco Valderlan Jorge Nobre', 'Rafael Lopes Gomes']::varchar[],
        'Fundação Universidade Estadual do Ceará e Rede Nacional de Ensino e Pesquisa',
        'Enquanto muitos estudos existentes se concentram em cenários mais simples ou não abordam o contexto realista de provedores de internet, o software aplica uma análise profunda utilizando medições fim-a-fim do PerfSONAR, cobrindo os diversos PoPs da RNP pelo Brasil. A ferramenta não só identifica problemas de desempenho, como congestionamentos e falhas de medição, mas também corrige automaticamente essas falhas, gerando dados mais precisos para análise.',
        'BR 51 2024 005022 1',
        'BR 51 2024 005022 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 005022 1'
          AND p.nome = 'CorrDelay: Correlação de Dados para Identificação de Links com Alto Atraso'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [032/242] PROGRAMA DE COMPUTADOR (Linha 29) - BR 51 2024 005019 1 - Lúdico
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Lúdico',
        'O jogo é uma ferramenta inovadora que adapta a dinâmica do clássico jogo de tabuleiro Ludo para o ensino de conceitos de programação. Ele oferece uma abordagem prática e interativa para o aprendizado de lógica de programação, utilizando a mecânica do jogo para estimular o raciocínio lógico de maneira divertida. Focado principalmente em iniciantes e jovens estudantes, esse recurso educacional combina elementos lúdicos com conteúdos técnicos, proporcionando um ambiente de aprendizado envolvente.',
        'UECE',
        'SOFTWARE',
        '2024-12-24'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Ismayle de Sousa Santos', 'Paulo Henrique Mendes Maia', 'Walter William Cavalcante de Castro']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Ao transformar o aprendizado de programação em uma experiência interativa e divertida, o jogo quebra as barreiras de complexidade muitas vezes associadas ao ensino de lógica de programação, tornando-o mais atraente e acessível, especialmente para iniciantes.',
        'BR 51 2024 005019 1',
        'BR 51 2024 005019 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 005019 1'
          AND p.nome = 'Lúdico'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [033/242] PROGRAMA DE COMPUTADOR (Linha 30) - BR 51 2024 003907 4 - Geek Gear - Rede social para entusiastas de hardware
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Geek Gear - Rede social para entusiastas de hardware',
        'A plataforma proposta é uma rede social especializada em hardware, voltada para a interação entre membros da comunidade, com foco no mercado de equipamentos gamer. Através da análise de performance do hardware de cada usuário, a plataforma oferece ranqueamento baseado em dados reais de desempenho, permitindo que os usuários compartilhem imagens e experiências de suas configurações e montagens de hardware.',
        'UECE',
        'SOFTWARE',
        '2024-10-29'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Ismayle de Sousa Santos', 'Vitor Monteiro de Novaes Menezes']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A utilização de ranqueamento e análise de dados para classificar e comparar configurações de hardware entre os membros da comunidade torna a plataforma uma ferramenta valiosa para quem deseja otimizar suas máquinas para jogos. Esse modelo de engajamento torna o processo de troca de informações mais dinâmico e atraente, ao mesmo tempo que oferece insights valiosos sobre o desempenho dos equipamentos, atendendo especialmente ao nicho de consumidores gamers em busca de melhores soluções de hardware.',
        'BR 51 2024 003907 4',
        'BR 51 2024 003907 4',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 003907 4'
          AND p.nome = 'Geek Gear - Rede social para entusiastas de hardware'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [034/242] PROGRAMA DE COMPUTADOR (Linha 31) - BR 51 2024 003584 2 - SP2Mic: Uma ferramenta para geração de código de microsserviços a part
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'SP2Mic: Uma ferramenta para geração de código de microsserviços a partir de stored procedures',
        'A tecnologia desenvolvida automatiza a criação de microsserviços a partir da leitura e análise de regras de negócio presentes em stored procedures. Utilizando um parser, a ferramenta examina o conteúdo das stored procedures e extrai informações essenciais, fornecendo ao engenheiro de software as bases para tomar decisões informadas sobre como gerar os microsserviços. O processo é semi-automatizado, permitindo que o engenheiro valide e ajuste os resultados antes da geração do código final, que é adaptado a uma plataforma específica.',
        'UECE',
        'SOFTWARE',
        '2024-10-08'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Ingrid Guedes Teles Coutinho', 'Marx Haron Gomes Barbosa', 'Paulo Henrique Mendes Maia']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O diferencial tecnológico da solução é a utilização das stored procedures como entrada para a geração automática de microsserviços. Ao aproveitar a lógica de negócios já existente no banco de dados, a ferramenta elimina a necessidade de reescrever a aplicação, proporcionando uma migração mais eficiente para arquiteturas de microsserviços.',
        'BR 51 2024 003584 2',
        'BR 51 2024 003584 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 003584 2'
          AND p.nome = 'SP2Mic: Uma ferramenta para geração de código de microsserviços a partir de stored procedures'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [035/242] PROGRAMA DE COMPUTADOR (Linha 32) - BR 51 2024 003130 8 - Bookstation - Sistema web de recomendação e gerenciamento de livros
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Bookstation - Sistema web de recomendação e gerenciamento de livros',
        'A tecnologia é uma aplicação web voltada para o gerenciamento e organização de leitura, além de oferecer recomendações de livros. A ferramenta foi desenvolvida para facilitar a criação do hábito de leitura, permitindo que os usuários adicionem livros à sua biblioteca pessoal, definam suas preferências de leitura e recebam sugestões baseadas nos seus gostos. Com um layout intuitivo, a aplicação proporciona uma experiência de uso simples, permitindo que os usuários encontrem e gerenciem seus livros de forma eficiente. A aplicação está disponível para uso em computadores e',
        'UECE',
        'SOFTWARE',
        '2024-09-03'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Andrei Freitas Costa Nunes dos Santos', 'Ismayle de Sousa Santos']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O diferencial tecnológico da tecnologia está na integração de recursos de recomendação de livros personalizados, com base nas preferências do usuário. A interface intuitiva permite uma navegação fácil, onde os usuários podem adicionar livros, organizar suas leituras e obter sugestões adequadas ao seu perfil de leitura. Além disso, por ser uma aplicação web, ela oferece a flexibilidade de ser acessada de qualquer dispositivo com acesso à internet, proporcionando uma solução prática e acessível para os amantes da leitura.',
        'BR 51 2024 003130 8',
        'BR 51 2024 003130 8',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 003130 8'
          AND p.nome = 'Bookstation - Sistema web de recomendação e gerenciamento de livros'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [036/242] PROGRAMA DE COMPUTADOR (Linha 33) - BR 51 2024 003129 4 - FMC-MIL: Função para treinar uma rede neural para detecção de anomalia
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'FMC-MIL: Função para treinar uma rede neural para detecção de anomalias em vídeos de vigilância com múltiplas câmeras sobrepostas e com rótulos de vídeo',
        'Trata-se de uma tecnologia para treinamento de um algoritmo de detecção de anomalias em vídeos com múltiplas câmeras sobrepostas, utilizando apenas rótulos de vídeo. O processo começa com a fragmentação de cada vídeo de treinamento em segmentos de 16 frames, que são então pré-processados em vetores de características por meio de um extrator de atributos de vídeo. A função utiliza um modelo de aprendizagem por múltiplas instâncias, adaptando-se ao cenário de múltiplas câmeras sobrepostas para melhorar a precisão na detecção de anomalias. Ao final do treinamento, um regressor de anomalias de vídeo é gerado, sendo capaz de identificar comportamentos anômalos nos vídeos analisados.',
        'UECE',
        'SOFTWARE',
        '2024-09-03'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['José Everardo Bessa Maia', 'Silas Santiago Lopes Pereira']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A ferramente permite a o uso inovador da aprendizagem por múltiplas instâncias, adaptada especificamente para cenários com múltiplas câmeras sobrepostas. Enquanto abordagens tradicionais de detecção de anomalias em vídeo podem se concentrar em imagens de uma única câmera, essa solução leva em conta a complexidade de integrar informações de várias câmeras ao mesmo tempo, ajustando o modelo preditivo para lidar com as interações e sobreposições entre os ângulos de captura.',
        'BR 51 2024 003129 4',
        'BR 51 2024 003129 4',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 003129 4'
          AND p.nome = 'FMC-MIL: Função para treinar uma rede neural para detecção de anomalias em vídeos de vigilância com múltiplas câmeras sobrepostas e com rótulos de vídeo'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [037/242] PROGRAMA DE COMPUTADOR (Linha 34) - BR 51 2024 002945 1 - Informa Diabetes
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Informa Diabetes',
        'O Portal Web Informa Diabetes é uma plataforma digital desenvolvida com o objetivo de fornecer informações educativas e promover o autocuidado para pessoas com diabetes tipo 2 e profissionais de saúde. O portal foi construído com base no Design Centrado no Usuário, em três etapas fundamentais: análise de requisitos, proposição de soluções alternativas e criação de protótipos testáveis.',
        'UECE',
        'SOFTWARE',
        '2024-08-20'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Florência Gamileira Nascimento', 'Shérida Karanini Paz de Oliveira']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A tecnologia se destaca por oferece uma série de posts informativos abordando temas como alimentação saudável, atividade física, uso de medicamentos, controle das taxas de glicose, entre outros tópicos essenciais para o autocuidado. Além disso, conta com funcionalidades como o “Você sabia?”, um dicionário diabético e um quiz interativo para testar os conhecimentos dos usuários.',
        'BR 51 2024 002945 1',
        'BR 51 2024 002945 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 002945 1'
          AND p.nome = 'Informa Diabetes'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [038/242] PROGRAMA DE COMPUTADOR (Linha 35) - BR 51 2024 002494 8 - Entrando na História: interagindo e escrevendo com personagens
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Entrando na História: interagindo e escrevendo com personagens',
        'Trata-se de um jogo interativo educacional destinado a alunos do 5º ano do Ensino Fundamental. O jogo permite ao usuário escolher um personagem (Amanda ou Pedro) e ajudá-los a realizar tarefas, como escrever uma lista de compras e comprar ingredientes para um bolo de aniversário. Durante o jogo, o usuário é incentivado a interagir com imagens e a escrever conforme descrito na receita, desenvolvendo habilidades de leitura e escrita. O jogo oferece também recursos de acessibilidade, como leitura visual e compreensão auditiva.',
        'UECE',
        'SOFTWARE',
        '2024-07-23'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Diogo Rolim Saraiva dos Santos', 'Ives Moreira Gomes', 'Regina Cláudia Pinheiro']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A principal inovação do jogo está em seu formato participativo e interativo, no qual o aluno se envolve ativamente em uma narrativa, exercendo a escrita e leitura em um contexto lúdico e prático. Além disso, a integração de recursos audiovisuais garante acessibilidade e engajamento, tornando o aprendizado mais acessível e dinâmico para os alunos do Ensino Fundamental.',
        'BR 51 2024 002494 8',
        'BR 51 2024 002494 8',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 002494 8'
          AND p.nome = 'Entrando na História: interagindo e escrevendo com personagens'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [039/242] PROGRAMA DE COMPUTADOR (Linha 36) - BR 51 2024 002442 5 - Entrando na História: interagindo e escrevendo com personagens-Linux
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Entrando na História: interagindo e escrevendo com personagens-Linux',
        'A tecnologia visa auxiliar crianças no processo de aprendizado de leitura e escrita. Ao contrário de outros jogos educativos, ele se destaca por proporcionar uma aprendizagem contextualizada e lúdica, permitindo que os alunos interajam com personagens da história. O foco do jogo é no desenvolvimento da produção de gêneros textuais e na leitura interativa, incentivando os estudantes a aplicarem o que aprendem em tarefas práticas, como escrever listas de compras e preencher convites de aniversário.',
        'UECE',
        'SOFTWARE',
        '2024-07-23'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Diogo Rolim Saraiva dos Santos', 'Ives Moreira Gomes', 'Regina Cláudia Pinheiro']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O jogo se diferencia dos exemplos como GrafoGame e Craque da Leitura por ir além da repetição de letras e palavras. Ele oferece uma abordagem mais engajante e contextualizada, permitindo que os alunos se envolvam ativamente na criação de textos e participem de uma história interativa.',
        'BR 51 2024 002442 5',
        'BR 51 2024 002442 5',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 002442 5'
          AND p.nome = 'Entrando na História: interagindo e escrevendo com personagens-Linux'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [040/242] PROGRAMA DE COMPUTADOR (Linha 37) - BR 51 2024 002440 9 - App Entrando na História: interagindo e escrevendo com personagens
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'App Entrando na História: interagindo e escrevendo com personagens',
        'A tecnologia trata-se de um jogo digital, em versão aplicativo, destinado ao Ensino Fundamental I, com o objetivo de ensinar leitura e escrita de maneira lúdica e contextualizada. O jogo permite que as crianças interajam com personagens, realizando atividades como a criação de listas de compras, escrita de convites de aniversário e diários, tudo com base em um enredo envolvente. Ao longo do processo, as crianças são incentivadas a escrever corretamente os nomes dos ingredientes para um bolo e organizar suas ideias em textos, desenvolvendo suas habilidades de escrita e leitura.',
        'UECE',
        'SOFTWARE',
        '2024-07-23'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Diogo Rolim Saraiva dos Santos', 'Ives Moreira Gomes', 'Regina Cláudia Pinheiro']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Diferente de outros jogos educativos disponíveis, que se concentram em repetições isoladas de letras e sílabas, o "Entrando na História" proporciona uma aprendizagem contextualizada. As atividades de leitura e escrita são realizadas para cumprir objetivos dentro de uma história interativa, criando um ambiente mais engajador e significativo para o aluno.',
        'BR 51 2024 002440 9',
        'BR 51 2024 002440 9',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 002440 9'
          AND p.nome = 'App Entrando na História: interagindo e escrevendo com personagens'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [041/242] PROGRAMA DE COMPUTADOR (Linha 38) - BR 51 2024 002233 3 - E-captar
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'E-captar',
        'O aplicativo desenvolvido tem como objetivo simplificar e agilizar os processos de detecção de morte encefálica e cadastro de potenciais doadores de órgãos em unidades de emergência e terapia intensiva no estado do Ceará. Construído em React Native, o aplicativo permite que profissionais de saúde registrem dados clínicos e conduzam os testes necessários para diagnosticar a morte encefálica, com a ajuda de algoritmos. Além disso, o aplicativo oferece uma interface intuitiva que facilita o preenchimento rápido e seguro das informações pessoais dos potenciais doadores, além de integrar-se aos sistemas de saúde para verificar a elegibilidade e confirmar os dados.',
        'UECE',
        'SOFTWARE',
        '2024-07-09'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Sandro Roberto Cavalcante Bandeira']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A tecnologia do aplicativo se destaca pela sua capacidade de integrar a detecção de morte encefálica e o cadastro para doação de órgãos em uma única plataforma móvel, utilizando algoritmos para guiar os profissionais de saúde nos procedimentos médicos.',
        'BR 51 2024 002233 3',
        'BR 51 2024 002233 3',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 002233 3'
          AND p.nome = 'E-captar'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [042/242] PROGRAMA DE COMPUTADOR (Linha 39) - BR 51 2024 002178 7 - SR-Edu: Sistema de recomendação de materiais para um ambiente virtual 
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'SR-Edu: Sistema de recomendação de materiais para um ambiente virtual educacional',
        'O SR-Edu é uma ferramenta desenvolvida para a área de educação a distância (EAD), com o objetivo de personalizar a experiência de aprendizado dos alunos. Através de um sistema de recomendação inteligente, o SR-Edu analisa o desempenho do aluno e identifica os tópicos nos quais ele apresenta dificuldades. Com base nessa análise, o sistema sugere questões ou materiais específicos para reforçar o aprendizado sobre os temas mais desafiadores para o aluno, promovendo uma aprendizagem adaptativa.',
        'UECE',
        'SOFTWARE',
        '2024-07-02'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Hugo Firmino Damasceno', 'Leonardo Sampaio Rocha']::varchar[],
        'Fundação Universidade Estadual do Ceará e Instituto de Gestão, Redes Tecnológicas e Energias',
        'O principal diferencial da tecnologia está em sua capacidade de personalizar o aprendizado de cada aluno de forma dinâmica, com base em seu desempenho. Ao integrar um sistema de recomendação com aprendizagem adaptativa, garante que os conteúdos oferecidos sejam sempre relevantes e direcionados às necessidades específicas do aluno. Essa abordagem permite que os alunos recebam suporte contínuo em áreas de dificuldade, facilitando seu progresso. Além disso, o sistema é capaz de se ajustar automaticamente às mudanças nas necessidades do aluno, proporcionando uma experiência de aprendizagem única e personalizada.',
        'BR 51 2024 002178 7',
        'BR 51 2024 002178 7',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 002178 7'
          AND p.nome = 'SR-Edu: Sistema de recomendação de materiais para um ambiente virtual educacional'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [043/242] PROGRAMA DE COMPUTADOR (Linha 40) - BR 51 2024 001607 4 - Corrida contra o diabetes
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Corrida contra o diabetes',
        'Este jogo digital foi desenvolvido com o objetivo de educar crianças e adolescentes sobre a prevenção, autocuidado e manejo do Diabetes Mellitus (DM). O jogo oferece uma plataforma interativa e lúdica, que permite aos usuários aprenderem sobre as causas, sintomas, tratamentos e medidas de prevenção do diabetes, independentemente de já serem diagnosticados ou não.',
        'UECE',
        'SOFTWARE',
        '2024-05-21'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Mateus Costa Avelar', 'Natália Silva Costa', 'Paulo Henrique Mendes Maia', 'Sherida Karanini Paz de Oliveira']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Através de atividades envolventes, o jogo promove mudanças nos comportamentos dos jogadores, incentivando hábitos saudáveis que podem prevenir o desenvolvimento da doença ou melhorar o controle do diabetes. O foco do jogo é fornecer informações importantes de forma acessível e divertida, tornando o aprendizado mais eficiente e agradável para o público jovem.',
        'BR 51 2024 001607 4',
        'BR 51 2024 001607 4',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 001607 4'
          AND p.nome = 'Corrida contra o diabetes'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [044/242] PROGRAMA DE COMPUTADOR (Linha 41) - BR 51 2024 000921 3 - DEA-SQLi: Detecção Escalável de Ameaças de Injeção de SQL
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'DEA-SQLi: Detecção Escalável de Ameaças de Injeção de SQL',
        'A tecnologia foi desenvolvida para atuar na proteção contra ataques de SQL Injection (SQLi), utilizando Expressões Regulares (RegEx) como técnica principal de filtragem. A solução é baseada em Python, utilizando o micro-framework Flask para a construção da API e Docker para gerenciar a execução em contêineres. O sistema adota o padrão Model-View-Controller (MVC) para organização do código e funcionalidades, garantindo uma estrutura limpa e eficiente. Através de um banco de dados que contém expressões regulares, o sistema pode testar requisições de texto em tempo real, identificando potenciais ataques de SQLi em qualquer sistema de informação.',
        'UECE',
        'SOFTWARE',
        '2024-03-26'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Michael Silva de Souza', 'Rafael Lopes Gomes', 'Silvio Eduardo Sales de Britto Ribeiro']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O diferencial inovador da solução DEA-SQLi está no uso de Expressões Regulares (RegEx) para detectar ataques de SQL Injection de forma rápida e eficiente. Sua arquitetura em Python, Flask e Docker oferece escalabilidade, desempenho e fácil implantação em diversos ambientes.',
        'BR 51 2024 000921 3',
        'BR 51 2024 000921 3',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 000921 3'
          AND p.nome = 'DEA-SQLi: Detecção Escalável de Ameaças de Injeção de SQL'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [045/242] PROGRAMA DE COMPUTADOR (Linha 42) - BR 51 2024 000920 5 - 2LD-SQLi: Dupla Camada de Detecção de Injeção de SQL
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        '2LD-SQLi: Dupla Camada de Detecção de Injeção de SQL',
        'A solução de detecção de Injeção de SQL combina ambientes de Borda e Nuvem, utilizando técnicas de Filtragem por Expressões Regulares (RegEx) e Machine Learning (ML). A filtragem inicial por RegEx é realizada no ambiente de Borda, proporcionando uma resposta rápida e eficiente para detectar entradas maliciosas. O resultado da filtragem é então analisado por um modelo de Machine Learning na Nuvem, aprimorando a precisão na detecção de SQL Injection (SQLi).',
        'UECE',
        'SOFTWARE',
        '2024-03-26'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Michael Silva de Souza', 'Rafael Lopes Gomes', 'Silvio Eduardo Sales de Britto Ribeiro']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O diferencial dessa solução está na combinação inteligente de Filtragem por RegEx na Borda com análise de Machine Learning na Nuvem. Essa abordagem híbrida não apenas melhora a eficiência no tempo de resposta, mas também aumenta a precisão da detecção de ataques SQLi, tornando a solução mais escalável e eficaz na identificação de ameaças em tempo real.',
        'BR 51 2024 000920 5',
        'BR 51 2024 000920 5',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 000920 5'
          AND p.nome = '2LD-SQLi: Dupla Camada de Detecção de Injeção de SQL'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [046/242] PROGRAMA DE COMPUTADOR (Linha 43) - BR 51 2024 000782 2 - Rottas
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Rottas',
        'A aplicação Rottas tem como objetivo principal fornecer um mapeamento das paradas de ônibus no campus do Pici/UFC, além de monitorar em tempo real a localização dos ônibus que operam dentro do campus. Através dessa ferramenta, os alunos podem planejar seus horários de forma otimizada, com informações sobre a localização atual dos ônibus, melhorando a eficiência no deslocamento e evitando o tempo de espera excessivo.',
        'UECE',
        'SOFTWARE',
        '2024-03-19'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Francisco Laurindo Costa Junior', 'Ismayle de Sousa Santos', 'Marcos Patrick Saraiva da Silva', 'Matheus de Almeida Esteban', 'Renan Mendes Frota', 'Rossana Maria de Castro Andrade']::varchar[],
        'Fundação Universidade Estadual do Ceará e Universidade Federal do Ceará',
        'O diferencial dessa tecnologia está no monitoramento em tempo real da localização dos ônibus, oferecendo aos alunos dados atualizados sobre os horários e trajetos dos ônibus. Isso proporciona uma experiência mais prática e eficiente, permitindo um planejamento de deslocamento mais inteligente e preciso dentro do campus.',
        'BR 51 2024 000782 2',
        'BR 51 2024 000782 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 000782 2'
          AND p.nome = 'Rottas'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [047/242] PROGRAMA DE COMPUTADOR (Linha 44) - BR 51 2024 000624 9 - T-For: An Adaptable Forecasting Model for Throughput Performance
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'T-For: An Adaptable Forecasting Model for Throughput Performance',
        'A tecnologia proposta aborda o gerenciamento e a previsão de tráfego de rede para Provedores de Internet (ISPs), com foco em lidar com a demanda elástica por recursos de rede que ocorre ao longo do dia, especialmente devido à mobilidade humana nas cidades. Por meio de um modelo avançado de previsão de tráfego, a solução utiliza séries temporais para analisar o histórico de uso da rede e prever a demanda futura. Isso permite que o ISP tome ações proativas, evitando problemas de lentidão, interrupções e desconexões, e ajude a planejar a infraestrutura de rede para atender de forma eficiente aos requisitos do Acordo de Nível de Serviço (SLA).',
        'UECE',
        'SOFTWARE',
        '2024-03-05'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Ariel Lima de Carvalho Portela', 'Rafael de Almeida Menezes', 'Rafael Lopes Gomes', 'Silvio Eduardo Sales de Britto Ribeiro']::varchar[],
        'Fundação Universidade Estadual do Ceará e Rede Nacional de Ensino e Pesquisa',
        'O diferencial dessa tecnologia é a capacidade de modelar séries temporais de forma mais precisa e adaptável, ajustando automaticamente a sazonalidade e removendo ciclos de erro, ao contrário das ferramentas existentes que dependem apenas de reduções automáticas por média móvel.',
        'BR 51 2024 000624 9',
        'BR 51 2024 000624 9',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 000624 9'
          AND p.nome = 'T-For: An Adaptable Forecasting Model for Throughput Performance'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [048/242] PROGRAMA DE COMPUTADOR (Linha 45) - BR 51 2024 000467 0 - Aplicativo de Teste do Relógio
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Aplicativo de Teste do Relógio',
        'O aplicativo digitaliza o Teste do Relógio, uma ferramenta importante para avaliar capacidades cognitivas de idosos. Através do aplicativo, o profissional de saúde pode solicitar ao paciente que monte um relógio movendo os números e os ponteiros para indicar uma hora específica fornecida pelo médico. O software permite registrar o resultado de forma automatizada, armazenando a imagem do relógio montado e gerando uma pontuação que pode ser utilizada no acompanhamento da função cognitiva do paciente. O aplicativo é voltado para profissionais que necessitam realizar avaliações cognitivas rápidas e eficientes em idosos.',
        'UECE',
        'SOFTWARE',
        '2024-02-27'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Antônio Luiz Martins Maia Filho', 'Clélia Santana Reis Damásio', 'Dario Brito Calçada', 'Dymas de Sousa Cunha', 'João Victor de Castro Oliveira', 'Leonardo Evangelista Mesquita']::varchar[],
        'Fundação Universidade Estadual do Ceará e Fundação da Universidade Estadual do Piauí',
        'O diferencial do aplicativo está na digitalização do Teste do Relógio, que facilita a aplicação e a análise dos resultados, eliminando a necessidade de materiais físicos e permitindo o armazenamento digital dos resultados para acompanhamento contínuo.',
        'BR 51 2024 000467 0',
        'BR 51 2024 000467 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 000467 0'
          AND p.nome = 'Aplicativo de Teste do Relógio'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [049/242] PROGRAMA DE COMPUTADOR (Linha 46) - BR 51 2024 000466 1 - Aplicativo de Mini Exame de Estado Mental
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Aplicativo de Mini Exame de Estado Mental',
        'O aplicativo automatiza a aplicação do Mini Exame de Estado Mental (MEEM), um importante teste para avaliação cognitiva de idosos. O aplicativo utiliza frameworks específicos para dispositivos móveis, proporcionando uma forma digital e simplificada de realizar o exame. Durante o processo, o profissional de saúde faz perguntas ao paciente, registra as respostas e, ao final, o aplicativo gera automaticamente a pontuação do teste. Além disso, o software oferece orientações práticas para otimizar o acompanhamento e o cuidado do paciente, facilitando o trabalho do profissional de saúde.',
        'UECE',
        'SOFTWARE',
        '2024-02-27'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Antônio Luiz Martins Maia Filho', 'Clélia Santana Reis Damásio', 'Dario Brito Calçada', 'Dymas de Sousa Cunha', 'João Victor de Castro Oliveira', 'Leonardo Evangelista Mesquita']::varchar[],
        'Fundação Universidade Estadual do Ceará e Fundação da Universidade Estadual do Piauí',
        'O principal diferencial do aplicativo está na automatização completa do Mini Exame de Estado Mental, permitindo uma aplicação mais rápida e precisa, com redução de erros humanos durante o processo de coleta e análise dos dados.',
        'BR 51 2024 000466 1',
        'BR 51 2024 000466 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 000466 1'
          AND p.nome = 'Aplicativo de Mini Exame de Estado Mental'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [050/242] PROGRAMA DE COMPUTADOR (Linha 47) - BR 51 2024 000414 9 - Aplicativo de Teste de Fluência Verbal
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Aplicativo de Teste de Fluência Verbal',
        'A ferramenta computacional foi desenvolvida para profissionais de saúde, com o objetivo de melhorar o acompanhamento e estímulo cognitivo de idosos. Baseada no Teste de Fluência Verbal, a solução permite avaliar a capacidade de uma pessoa em verbalizar o maior número possível de palavras em um tempo limitado. O programa realiza a contabilização e mensuração dessas palavras de forma automática, gerando uma pontuação que ajuda a monitorar a cognição do indivíduo ao longo do tempo. Voltado para o acompanhamento de idosos ou pessoas com necessidades cognitivas, o software oferece uma maneira prática e eficiente de avaliar e estimular as funções cognitivas.',
        'UECE',
        'SOFTWARE',
        '2024-02-20'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Antônio Luiz Martins Maia Filho', 'Clélia Santana Reis Damásio', 'Dario Brito Calçada', 'Dymas de Sousa Cunha', 'João Victor de Castro Oliveira', 'Leonardo Evangelista Mesquita']::varchar[],
        'Fundação Universidade Estadual do Ceará e Fundação da Universidade Estadual do Piauí',
        'O diferencial da ferramenta é a automatização da pontuação no Teste de Fluência Verbal, o que torna o processo de análise cognitiva mais rápido e preciso. A solução proporciona um acompanhamento contínuo da saúde cognitiva, permitindo que os profissionais de saúde monitorem o progresso dos idosos de maneira eficiente.',
        'BR 51 2024 000414 9',
        'BR 51 2024 000414 9',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 000414 9'
          AND p.nome = 'Aplicativo de Teste de Fluência Verbal'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [051/242] PROGRAMA DE COMPUTADOR (Linha 48) - BR 51 2024 000254 5 - WebMoney - Gestão de Finanças Pessoais
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'WebMoney - Gestão de Finanças Pessoais',
        'A tecnologia é uma ferramenta de gestão e organização financeira que utiliza gamificação para facilitar a criação do hábito de acompanhar as finanças pessoais. Com o objetivo de oferecer uma forma prática e divertida de monitorar as finanças, a plataforma permite que os usuários acompanhem seus gastos, criem lembretes de pagamento e se envolvam com seus objetivos financeiros de maneira interativa. A ferramenta é responsiva, o que garante que o usuário possa acessá-la de diferentes dispositivos, como celulares e computadores, desde que tenham acesso à internet.',
        'UECE',
        'SOFTWARE',
        '2024-02-06'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Ismayle de Sousa Santos', 'Raimundo Angeliano Gonçalves de Sousa']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A aplicação se destaca por sua abordagem inovadora de integrar gamificação ao controle financeiro, transformando o processo de gestão de finanças pessoais em algo mais interativo e envolvente. Os usuários são incentivados a cumprir metas financeiras e são recompensados à medida que avançam, o que facilita a adesão ao uso constante da ferramenta.',
        'BR 51 2024 000254 5',
        'BR 51 2024 000254 5',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 000254 5'
          AND p.nome = 'WebMoney - Gestão de Finanças Pessoais'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [052/242] PROGRAMA DE COMPUTADOR (Linha 49) - BR 51 2024 000076 3 - Aventura Bucal: Jogo digital educativo para prevenção e promoção da sa
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Aventura Bucal: Jogo digital educativo para prevenção e promoção da saúde bucal em crianças',
        'O "Aventura Bucal" é um jogo digital desenvolvido para a área de odontopediatria, voltado para crianças de 8 a 12 anos. Seu principal objetivo é educar as crianças sobre a importância da higiene bucal e incentivar o desenvolvimento de hábitos adequados de cuidados com os dentes. O jogo proporciona uma experiência interativa, na qual as crianças aprendem, de forma envolvente, como escovar os dentes corretamente, usar fio dental e adotar práticas que ajudam na manutenção da saúde bucal.',
        'UECE',
        'SOFTWARE',
        '2024-01-16'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Luciana Bonfim Jacó de Oliveira', 'Maria Salete Bessa Jorge', 'Paulo Henrique Mendes Maia']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O diferencial da tecnologia reside na sua capacidade de transformar o aprendizado sobre saúde bucal em uma experiência lúdica e autônoma. Ao invés de ser apenas uma atividade passiva, o jogo promove o envolvimento das crianças por meio de desafios e atividades que reforçam hábitos de higiene bucal de maneira divertida.',
        'BR 51 2024 000076 3',
        'BR 51 2024 000076 3',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2024 000076 3'
          AND p.nome = 'Aventura Bucal: Jogo digital educativo para prevenção e promoção da saúde bucal em crianças'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [053/242] PROGRAMA DE COMPUTADOR (Linha 50) - BR512023003527-0 - SuperSeg: Superpixel Segmentation of DICOM Images
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'SuperSeg: Superpixel Segmentation of DICOM Images',
        'A segmentação de objetos (órgãos, tecidos etc.) em imagens médicas requer um software que leia e acesse a imagem no nível de pixel, para que o usuário classifique cada pixel de acordo com a classe
desejada. Esse de processo de segmentação é demorado e exige um profissional especializado em anatomia humana. O sobressegmenta automaticamente a imagem, agrupando pixels em regiões
adjacentes com alta similaridade de cor. Isso reduz sobremaneira o tempo de segmentação, pois o número desses agrupamentos é bastante inferior ao número total de pixels da imagem original. Além
disso, as fronteiras entre os objetos são capturadas com boa precisão, dependendo somente do número de agrupamentos escolhidos pelo usuário.',
        'UECE',
        'SOFTWARE',
        '2023-11-16'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Alberto Luian de Lima Marques', 'domingos Bruno Sousa Santos', 'Gabriel Furtado Lins Melo', 'Thelmo Pontes de Araujo', 'Victor Wilker dos Santos de Oliveira']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Profissionais da saúde podem utilizar o SuperSeg para segmentar imagens médicas no formato DICOM
com relativa facilidade e rapidez. Pesquisas na área de Computação que utilizam Aprendizado de
Máquina (Machine Learning - ML) também serão facilitadas pelo uso do SuperSeg, já que poderão obter
uma grande quantidade de máscaras (quantidade essa necessária à fase de aprendizado dos modelos
de ML) de segmentação num menor espaço de tempo.',
        'BR512023003527-0',
        'BR512023003527-0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR512023003527-0'
          AND p.nome = 'SuperSeg: Superpixel Segmentation of DICOM Images'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [054/242] PROGRAMA DE COMPUTADOR (Linha 51) - BR 51 2023 003243 3 - SysPAD: Proteção e Privacidade de Dados em Sistemas Legados
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'SysPAD: Proteção e Privacidade de Dados em Sistemas Legados',
        'Vários casos de vazamento de dados ocorreram em todo o mundo nos últimos anos. Estes casos fazem
com que sejam implantadas soluções para mitigar essas ameaças de vazamento de dados, bem como
que estas soluções não alterem os sistemas legados. A partir dessa necessidade, foi desenvolvida a
solução SysPAD (Sistema para Proteção e Privacidade de Dados em Sistemas Legados) para proteção
de dados e privacidade.',
        'UECE',
        'SOFTWARE',
        '2023-10-26'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Danielle dos Santos Silva', 'douglas Araújo Da Silva', 'Jonas Nogueira Da Silva Neto', 'Maria Clara Mesquita Moura Ferreira', 'Matheus Monteiro Silveira', 'Michael Silva de Souza', 'Rafael Lopes Gomes']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A tecnologia visa habilitar que as empresas e instituições armazenarem e/ou divulgarem
dados sem ferir as leis de privacidade, evitando que, mesmo que ocorram casos de vazamento de dados,
estas sofram as sanções previstas na lei',
        'BR 51 2023 003243 3',
        'BR 51 2023 003243 3',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2023 003243 3'
          AND p.nome = 'SysPAD: Proteção e Privacidade de Dados em Sistemas Legados'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [055/242] PROGRAMA DE COMPUTADOR (Linha 52) - BR 51 2023 003241 7 - IoT-Anon: Data Anonimization Techniques in IoT devices
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'IoT-Anon: Data Anonimization Techniques in IoT devices',
        'A criação de Leis de Privacidade de Dados demandou a necessidade da aplicação de técnicas deproteção de dados, dentre elas os algoritmos de anonimização. Contudo, há poucos estudos na literatura
que analisam de forma experimental a implementação desses algoritmos em dispositivos de Internet das Coisas (IoT), os quais possuem diferentes capacidades de recursos computacionais.',
        'UECE',
        'SOFTWARE',
        '2023-10-26'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Arthur Cordeiro Urbano', 'Rafael Lopes Gomes']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'dentro deste contexto, a solução proposta habilita o uso de técnicas de anonimização em dispositivos IoTem hardwares com características heterogêneas.',
        'BR 51 2023 003241 7',
        'BR 51 2023 003241 7',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2023 003241 7'
          AND p.nome = 'IoT-Anon: Data Anonimization Techniques in IoT devices'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [056/242] PROGRAMA DE COMPUTADOR (Linha 53) - BR 51 2023 003240 9 - UroHemato App
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'UroHemato App',
        'O aplicativo dispõe de uma tela inicial, nela consta o título do aplicativo assim como o que ele
fornece, seguido da possibilidade de criar uma conta ou simplesmente utilizar o app. A partir
daí o usuário terá acesso às telas subsequentes que correspondem à avaliação do paciente,
segundo os guidelines selecionados.',
        'UECE',
        'SOFTWARE',
        '2023-10-26'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Manoel Miqueias Maia', 'Rafael Paiva Arruda', 'Rommel Prata Regadas']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A presente tecnologia possui como diferencial ser de fácil uso, baixo custo e de boa acessibilidade no tratamento de hematúria.',
        'BR 51 2023 003240 9',
        'BR 51 2023 003240 9',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2023 003240 9'
          AND p.nome = 'UroHemato App'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [057/242] PROGRAMA DE COMPUTADOR (Linha 54) - BR 51 2023 003235 2 - MonTh: Automated Monitoring of IP Threats
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'MonTh: Automated Monitoring of IP Threats',
        'A crescente sofisticação das ameaças cibernéticas exige que soluções avançadas para proteger a integridade e confidencialidade dos dados. Uma abordagem para lidar com este cenário é Inteligência sobre Ameaças que desempenha um papel crucial, permitindo que empresas e instituições coletem dados sobre possíveis ameaças e, a partir desses dados, possam lidar com incidentes de segurança.',
        'UECE',
        'SOFTWARE',
        '2023-10-25'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Arthur Cordeiro Urbano', 'Rafael Lopes Gomes']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'dentro deste contexto, este trabalho apresenta a ferramenta chamada MonTh para Monitoramento Automatizado de Bases de Ameaças, coletando dados das bases VirusTotal, AbuseIPDB, Shodan, IBM X-Force e AlienVault, onde esta ferramenta habilita que as empresas/instituições possam se atualizar de forma automatizada sobre novas ameças que surgem através de indicativos valiosos sobre IPs e domínios suspeitos.',
        'BR 51 2023 003235 2',
        'BR 51 2023 003235 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2023 003235 2'
          AND p.nome = 'MonTh: Automated Monitoring of IP Threats'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [058/242] PROGRAMA DE COMPUTADOR (Linha 55) - BR 51 2023 003232 8 - SoPhiD: Software for Phishing detection
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'SoPhiD: Software for Phishing detection',
        'O roubo de informações confidenciais, usando um site falso que imita um site confiável é denominado phishing. A estratégia de phishing foi declarada como a principal abordagem usada pelos invasores para explorar a privacidade do usuário na internet. Várias soluções para esse tipo de ataque foram propostas,como heurísticas, listas negras e brancas e técnicas baseadas em aprendizado de máquina em grafos. Assim, o objetivo desta criação é propor e validar uma nova abordagem para a detecção de phishing, que utiliza uma abordagem de aprendizado de máquina sobre um grafo de links e features de URL e certificado SSL.',
        'UECE',
        'SOFTWARE',
        '2023-10-25'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Leonardo Sampaio Rocha', 'Rhayane Da Silva Monteiro']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Obteve-se um algoritmo com 93% de acurácia, que é utilizado pela aplicação para que o usuário final possa consultar se o site é legítimo ou phishing. Os resultados reforçam a relevância do software proposto para identificar páginas da Web falsas.',
        'BR 51 2023 003232 8',
        'BR 51 2023 003232 8',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2023 003232 8'
          AND p.nome = 'SoPhiD: Software for Phishing detection'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [059/242] PROGRAMA DE COMPUTADOR (Linha 56) - BR 51 2023 001538 5 - SJud - Sistema de acompanhamento as demandas judiciais de medicamentos
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'SJud - Sistema de acompanhamento as demandas judiciais de medicamentos e insumos',
        'o sistema subsidiará informações sobre o perfil dos processos judiciais para acesso a medicamentos e insumos, gerando dados seguros para embasar tomadas de decisão pelos gestores contribuindo para maior eficiência na gestão pública, tanto de forma direta como
indireta.',
        'UECE',
        'SOFTWARE',
        '2023-06-02'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Maria Salete Bessa Jorge', 'Paulo Henrique Mendes Maia', 'Sinara Alves Tomás']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A tecnologia proporciona melhor atendimento aos solicitantes,
trazendo tratamento oportuno e otimização de custos por meio do
gerenciamento das aquisições e do monitoramento dos estoques.',
        'BR 51 2023 001538 5',
        'BR 51 2023 001538 5',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2023 001538 5'
          AND p.nome = 'SJud - Sistema de acompanhamento as demandas judiciais de medicamentos e insumos'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [060/242] PROGRAMA DE COMPUTADOR (Linha 57) - BR 51 2023 001383 8 - IoT-ID: Identificação de Dispositivos IoT usando Dados de Rede Anonimi
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'IoT-ID: Identificação de Dispositivos IoT usando Dados de Rede Anonimizados',
        'O objetivo da tecnologia é identificar dispositivos IoT usando modelos de Inteligência Artificial a partir de características de tráfego de rede anonimizadas.',
        'UECE',
        'SOFTWARE',
        '2023-05-17'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Ariel Lima de Carvalho Portela', 'Rafael de Almeida Menezes', 'Rafael Lopes Gomes', 'Wanderson Leonardo Costa']::varchar[],
        'Fundação Universidade Estadual do Ceará/ Rede Nacional de Ensino e Pesquisa',
        'A tecnologia visa pesquisar a forma de anonimização de tráfego, as técnicas de seleção de características existentes e analisar o desempenho dos modelos de IA para realizar a identificação.',
        'BR 51 2023 001383 8',
        'BR 51 2023 001383 8',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2023 001383 8'
          AND p.nome = 'IoT-ID: Identificação de Dispositivos IoT usando Dados de Rede Anonimizados'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [061/242] PROGRAMA DE COMPUTADOR (Linha 58) - BR 51 2023 001380 3 - PPM-Anon: Permutation and Proprieties Maintenance Anonymization
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'PPM-Anon: Permutation and Proprieties Maintenance Anonymization',
        'A computação em nuvem provê um armazenamento confiável e escalável, mas também representa novos desafios em relação à proteção de dados e questões de privacidade. Uma abordagem adequada para superar esses desafios é o uso de anonimização, que fornece os aspectos de proteção e privacidade dos dados.',
        'UECE',
        'SOFTWARE',
        '2023-05-17'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Matheus Monteiro Silveira', 'Rafael Lopes Gomes']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'dentro deste contexto, foi desenvolvido o Permutation and Proprieties Maintenance Anonymization (PPM-Anon) para evitar problemas de vazamento de dados e violação de privacidade. O PPM-Anom gera dados sintéticos mantendo propriedades matemáticas, como média e desvio padrão, permutando os autovetores ao invés de gerar novos, o que evita a precisão erros nessas medidas.',
        'BR 51 2023 001380 3',
        'BR 51 2023 001380 3',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2023 001380 3'
          AND p.nome = 'PPM-Anon: Permutation and Proprieties Maintenance Anonymization'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [062/242] PROGRAMA DE COMPUTADOR (Linha 59) - BR 51 2023 001372 2 - SSE-DB: Searchable Symmetric Enrcryption for Databases
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'SSE-DB: Searchable Symmetric Enrcryption for Databases',
        'A computação em nuvem surgiu como um ambiente adequado para armazenar dados com acesso remoto confiável e escalável, mas também representa novos desafios em relação à proteção de dados e questões de privacidade. Uma abordagem adequada para superar esses desafios é o uso de criptografia, que fornece os aspectos de proteção e privacidade dos dados. No entanto, em geral, os dados criptografados não podem ser usados pelos sistemas originais, pois funções usuais, como consultas e cálculos de banco de dados, precisam dos dados originais. Além disso, é muito caro realizar a criptografia e descriptografia do banco de dados para buscar e obter dados, pois essas técnicas possuem um alto custo computacional.',
        'UECE',
        'SOFTWARE',
        '2023-05-16'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Danielle dos Santos Silva', 'Matheus Monteiro Silveira', 'Rafael Lopes Gomes']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Para lidar com este cenário, foi desenvolvida a solução Searchable Symmetric Encryption for Databases (SSE-DB) para proteger dados privados em bancos de dados de ambientes de nuvem, evitando problemas de vazamento de dados e violações de privacidade, enquanto permite aos usuários armazenar dados mantendo a funcionalidade para pesquisar palavras-chave em seu banco de dados criptografado. Nossa nova abordagem supera a limitação de processamento lento, permitindo uma maior eficácia ao considerar grandes bancos de dados e dados dinâmicos.',
        'BR 51 2023 001372 2',
        'BR 51 2023 001372 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2023 001372 2'
          AND p.nome = 'SSE-DB: Searchable Symmetric Enrcryption for Databases'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [063/242] PROGRAMA DE COMPUTADOR (Linha 60) - BR 51 2023 001370 6 - Disfunção erétil no consultório APP
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Disfunção erétil no consultório APP',
        'O tratamento da disfunção erétil é um assunto complexo, com várias nuances, sendo que cada paciente deve ser avaliado individualmente e o tratamento muda caso a caso, dependendo da doença de base, não havendo um tratamento padrão para todos os pacientes. Recentemente, com a explosão do número de escolas médicas, muitas delas com estrutura e ensino de má́ qualidade, tem aumentado a preocupação em relação ao tratamento e seguimento correto desses pacientes pelos novos profissionais. O uso de aparelhos móveis por profissionais de saúde está́ cada vez maior, sendo uma ferramenta acessível a todas as categorias, podendo ser uma ferramenta de auxílio para melhorar a precisão diagnóstica e terapêutica. O objetivo do projeto visa o desenvolvimento de aplicativo móvel que auxilie médicos não urologistas a tratar pacientes com disfunção erétil com gravidade leve à moderada. Foi desenvolvido um aplicativo no qual os médicos obtêm uma classificação para a gravidade da disfunção erétil e em seguida uma conduta para cada caso. O aplicativo foi nomeado Disfunção erétil no consultório',
        'UECE',
        'SOFTWARE',
        '2023-05-16'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Luís Antônio Lima Solon', 'Manoel Miqueias Maia', 'Rommel Prata Regadas', 'Rômulo Augusto Da Silveira']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O aplicativo Disfunção Erétil no Consultório foi capaz de melhorar substancialmente os acertos nas condutas médicas iniciais e terapêuticas sobre o assunto Disfunção Erétil para os médicos NUCA. Esta importante melhora foi semelhante a capacidade dos médicos urologistas na condução clínica destes pacientes o aplicativo foi utilizado para responder casos clínicos de pacientes com disfunção erétil com sinais e sintomas perfeitamente descritos na história clínica',
        'BR 51 2023 001370 6',
        'BR 51 2023 001370 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2023 001370 6'
          AND p.nome = 'Disfunção erétil no consultório APP'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [064/242] PROGRAMA DE COMPUTADOR (Linha 61) - BR 51 2023 001369 2 - www.deltanolab.net
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'www.deltanolab.net',
        'Trata-se de um portal web colaborativo com o objetivo de fornecer as informações para que os laboratórios de análises clínicas possam inserir em sua rotina o uso da ferramenta delta check e com um fórum para que os profissionais possam tirar dúvidas e discutir como implantar a ferramenta de acordo com a realidade de cada laboratório e também trocar experiências com o uso da ferramenta.',
        'UECE',
        'SOFTWARE',
        '2023-05-16'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Gilvan Morais Neto Lira', 'Maria Salete Bessa Jorge', 'Paulo Henrique Mendes Maia']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        NULL,
        'BR 51 2023 001369 2',
        'BR 51 2023 001369 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2023 001369 2'
          AND p.nome = 'www.deltanolab.net'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [065/242] PROGRAMA DE COMPUTADOR (Linha 62) - BR 51 2023 000819 2 - Humanizagestor.com_Portal de Implementação da Politica Nacional de Hum
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Humanizagestor.com_Portal de Implementação da Politica Nacional de Humanização em saúde bucal',
        'A tecnologia trata-se de um portal, que tem como objetivo o acesso a informação e atualização de experiências vividas, no contexto da Política Nacional de Humanização(PNH) nas unidades do SUS.',
        'UECE',
        'SOFTWARE',
        '2023-03-23'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Haroldo Castro de Alcantara', 'Raquel Sampaio Florêncio']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O diferencial da tecnologia, é que a mesma é voltada para gestores em saúde pública, sejam coordenadores de saúde bucal, diretores de Centro de Especialidades Odontológicas(CEO), coordenadores de atenção primária em saúde, coordenadores de vigilância epidemiológica, coordenadores de vigilância sanitária, secretários municipais ou estaduais de saúde, pesquisadores em geral, profissionais de diversas áreas que tenham interesse no conhecimento do Humanizasus e em experiências exitosas ou ainda estudantes de graduação e pós graduação.',
        'BR 51 2023 000819 2',
        'BR 51 2023 000819 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2023 000819 2'
          AND p.nome = 'Humanizagestor.com_Portal de Implementação da Politica Nacional de Humanização em saúde bucal'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [066/242] PROGRAMA DE COMPUTADOR (Linha 63) - BR 51 2023 000544 4 - eHealthSys Visualização de Dados
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'eHealthSys Visualização de Dados',
        'A presente tecnologia, trata-se de um mecanismo para Classificação de doenças em ECG e Prevenção de SEPSE em Ambiente Seguro de Computação em
Nuvem usando Inteligência Artificial, visando realizar a visualização dos dados obtidos.',
        'UECE',
        'SOFTWARE',
        '2023-03-08'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Diego Alysson Braga Moreira', 'Joaquim Celestino Júnior', 'Kílvia Letícia de Abreu Almeida', 'Levy Gurgel Chaves', 'Mateus Rodrigues Lima', 'Rafael Lopes Gomes', 'Samuel Façanha Câmara', 'Thiago Pinho Serpa']::varchar[],
        'Fundação Universidade Estadual do Ceará/ Rede Nacional de Ensino e Pesquisa',
        'Diagnosticar doenças Cardíacas e
Sepse (via Inteligência Artificial) em uma plataforma Big Data e adaptável ao paciente.',
        'BR 51 2023 000544 4',
        'BR 51 2023 000544 4',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2023 000544 4'
          AND p.nome = 'eHealthSys Visualização de Dados'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [067/242] PROGRAMA DE COMPUTADOR (Linha 64) - BR 51 2023 000543 6 - eHealthSys Comunicação de Dados
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'eHealthSys Comunicação de Dados',
        'A presente tecnologia, trata-se de um mecanismo para Classificação de doenças em ECG e Prevenção de SEPSE em Ambiente Seguro de Computação em
Nuvem usando Inteligência Artificial, visando realizar a comunicação dos dados obtidos.',
        'UECE',
        'SOFTWARE',
        '2023-03-08'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Diego Alysson Braga Moreira', 'Joaquim Celestino Júnior', 'Kílvia Letícia de Abreu Almeida', 'Levy Gurgel Chaves', 'Mateus Rodrigues Lima', 'Rafael Lopes Gomes', 'Samuel Façanha Câmara', 'Thiago Pinho Serpa']::varchar[],
        'Fundação Universidade Estadual do Ceará/ Rede Nacional de Ensino e Pesquisa',
        'Diagnosticar doenças Cardíacas e
Sepse (via Inteligência Artificial) em uma plataforma Big Data e adaptável ao paciente.',
        'BR 51 2023 000543 6',
        'BR 51 2023 000543 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2023 000543 6'
          AND p.nome = 'eHealthSys Comunicação de Dados'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [068/242] PROGRAMA DE COMPUTADOR (Linha 65) - BR 51 2023 000542 8 - eHealthSys Coleta de Dados
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'eHealthSys Coleta de Dados',
        'A presente tecnologia, trata-se de um mecanismo para Classificação de doenças em ECG e Prevenção de SEPSE em Ambiente Seguro de Computação em
Nuvem usando Inteligência Artificial, visando realizar a coleta dos dados obtidos.',
        'UECE',
        'SOFTWARE',
        '2023-03-08'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Diego Alysson Braga Moreira', 'Joaquim Celestino Júnior', 'Kílvia Letícia de Abreu Almeida', 'Levy Gurgel Chaves', 'Mateus Rodrigues Lima', 'Rafael Lopes Gomes', 'Samuel Façanha Câmara', 'Thiago Pinho Serpa']::varchar[],
        'Fundação Universidade Estadual do Ceará/ Rede Nacional de Ensino e Pesquisa',
        'Diagnosticar doenças Cardíacas e
Sepse (via Inteligência Artificial) em uma plataforma Big Data e adaptável ao paciente.',
        'BR 51 2023 000542 8',
        'BR 51 2023 000542 8',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2023 000542 8'
          AND p.nome = 'eHealthSys Coleta de Dados'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [069/242] PROGRAMA DE COMPUTADOR (Linha 66) - BR 51 2022 002696 1 - MicroMon: Plataforma baseada em Microsserviços para Coleta e Compartil
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'MicroMon: Plataforma baseada em Microsserviços para Coleta e Compartilhamento de Medições de Rede',
        'Uma Plataforma baseada em Microsserviços para Coleta e
Compartilhamento de Medições de Rede” visa coletar e disponibilizar dados de medições de
rede, possibilitando a realização de diversas tarefas de forma automatizada, escalável e
extensível.',
        'UECE',
        'SOFTWARE',
        '2022-09-27'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Adrilene Pessoa Da Fonseca', 'Arthur Cordeiro Urbano', 'denis Menezes de Sousa', 'Matheus Monteiro Silveira', 'Paulo Henrique Mendes Maia', 'Rafael Lopes Gomes']::varchar[],
        'Fundação Universidade Estadual do Ceará/ Rede Nacional de Ensino e Pesquisa',
        'a tecnologia permite a implantação de novos serviços de
monitoramento, como predição de demanda, tomada de decisão, análise de dados de
telemetria intra-banda, coexistência de protocolos, etc.',
        'BR 51 2022 002696 1',
        'BR 51 2022 002696 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2022 002696 1'
          AND p.nome = 'MicroMon: Plataforma baseada em Microsserviços para Coleta e Compartilhamento de Medições de Rede'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [070/242] PROGRAMA DE COMPUTADOR (Linha 67) - BR 51 2022 002465 9 - PyNetFlow: Uma ferramenta para visualização e análise de tráfego
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'PyNetFlow: Uma ferramenta para visualização e análise de tráfego',
        'Pacotes de rede transmitem informações de um ponto a outro através da Internet. Estes pacotes carregam em sua estrutura, os detalhes e informações sobre o conteúdo transmitido, como seu endereçamento fonte e destino, o tamanho do conteúdo compartilhado e a própria carga útil, a informação transmitida. Essas informações são úteis quando se fala em análise de tráfego, pois com elas é possível elaborar várias rotinas que podem ser usadas para o cálculo de métricas sobre da rede. Para isso, faz-se necessário uma ferramenta que consiga coletar e processar essas informações contidas nos pacotes que estão sendo transmitidos no fluxo de comunicação, mostrando os resultados de forma legível aos seres humanos, habilitando uma tomada de decisões de gerenciamento e otimização da rede.',
        'UECE',
        'SOFTWARE',
        '2022-09-06'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Lucas José Pereira de Araújo', 'Rafael Lopes Gomes']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A presente ferramenta visa capturar os pacotes do fluxo de rede de forma passiva, e mostrar, em tela e em tempo de execução, informações sobre os endereços de origem e destino dos pacotes, protocolos de transporte que estão seguindo, e, ao final da execução, será mostrado um relatório gerencial contendo os dados processados da última leitura.',
        'BR 51 2022 002465 9',
        'BR 51 2022 002465 9',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2022 002465 9'
          AND p.nome = 'PyNetFlow: Uma ferramenta para visualização e análise de tráfego'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [071/242] PROGRAMA DE COMPUTADOR (Linha 68) - BR 51 2022 002274 5 - UroHPB
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'UroHPB',
        'A hiperplasia prostática benigna (HPB) é uma doença muito comum entre homens idosos, tratando-se de quarta doença crônica mais prevalente. Apresenta sintomas que impactam diretamente a qualidade de vida desses homens e interferem na produtividade daqueles que ainda estão inseridos no mercado de trabalho. O uso de aparelhos móveis por profissionais de saúde está cada vez maior, sendo uma ferramenta acessível a todas as categorias, que pode ser uma ferramenta de auxílio para melhorar a precisão diagnóstica e terapêutica. O objetivo do aplicativo móvel auxilia médicos não urologistas a tratar pacientes com HPB. Foi desenvolvido um aplicativo no qual os médicos podem inserir os dados clínicos dos pacientes e obter uma conduta para cada caso. O aplicativo foi nomeado UroHPB.',
        'UECE',
        'SOFTWARE',
        '2022-08-22'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Bruno Moreira Mapurunga', 'Manoel Miqueias Maia', 'Rommel Prata Regadas']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O aplicativo UroHPB foi capaz de aumentar a capacidade diagnóstica/terapêutica de médicos não urologistas sobre o assunto HPB.',
        'BR 51 2022 002274 5',
        'BR 51 2022 002274 5',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2022 002274 5'
          AND p.nome = 'UroHPB'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [072/242] PROGRAMA DE COMPUTADOR (Linha 69) - BR 51 2022 002269 9 - Hashing de Dados em Dispositivos IoT de Baixa Capacidade Computacional
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Hashing de Dados em Dispositivos IoT de Baixa Capacidade Computacional',
        'Recentemente a da Internet das Coisas (IoT) emergiu a fim de garantir a produção eficiente e sustentável para o contexto de ambientes inteligentes, Indústria 4.0. Porém como são dispositivos com pouca memória e baixa capacidade de processamento, a segurança destes dispositivos fica a desejar, sendo uma das maneiras de amenizar esse problema sendo por meio de algoritmos de Hash, que se mostram uma alternativa segura e viável de ser implementada dentro dos dispositivos.',
        'UECE',
        'SOFTWARE',
        '2022-08-22'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Eduardo Estevam Pimentel Mosca', 'Rafael Lopes Gomes']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'dentro deste contexto se apresenta uma análise dos concisa dos principais algoritmos de Hashing, apresentando consumo de processamento e memória com diferentes tipos de tamanhos de dados, visando chegar em uma solução sobre qual seria o melhor custo beneficio em termos gerais de utilização para os dispositivos',
        'BR 51 2022 002269 9',
        'BR 51 2022 002269 9',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2022 002269 9'
          AND p.nome = 'Hashing de Dados em Dispositivos IoT de Baixa Capacidade Computacional'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [073/242] PROGRAMA DE COMPUTADOR (Linha 70) - BR 51 2022 001318 5 - MIC: Algoritmo de Mitigação da Interferência Cruzada em Ambientes Inte
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'MIC: Algoritmo de Mitigação da Interferência Cruzada em Ambientes Inteligentes',
        'O programa é capaz de encontrar uma configuração de canais utilizados pelos pontos de acesso que minimiza a interferência sofrida pelos dispositivos conectados aos mesmos de forma escalável. A especificação dos padrões que definem as tecnologias de comunicação wifi e zigbee não apresenta um padrão para realizar a conexão dos clientes aos pontos de acesso nem como os diferentes dispositivos irão compartilhar os canais de comunicação disponíveis. Em via disso é comum que os produtos vendidos no mercado venham com um canal pré-definido, o que pode acarretar em muitos dispositivos utilizando o mesmo canal degradando o desempenho da rede. Adicionalmente a isso a conexão dos clientes aos pontos de acesso normalmente é feita considerando-se apenas a força do sinal o que torna o uso da rede desbalanceado conforme o número de dispositivos aumenta.',
        'UECE',
        'SOFTWARE',
        '2022-05-31'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Francisco Alexandre Araújo Rocha', 'Rafael Lopes Gomes']::varchar[],
        'Fundação Universidade Estadual do Ceará/ Instituto Federal de Educação, Ciência E Tecnologia do Ceará',
        'O programa em questão é capaz de evitar a sobrecarga dos pontos de acesso bem como atribuir canais aos mesmos de forma a maximizar a performance da rede em ambientes inteligentes.',
        'BR 51 2022 001318 5',
        'BR 51 2022 001318 5',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2022 001318 5'
          AND p.nome = 'MIC: Algoritmo de Mitigação da Interferência Cruzada em Ambientes Inteligentes'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [074/242] PROGRAMA DE COMPUTADOR (Linha 71) - BR 51 2022 001300 2 - SISPRAIA: Sistema Integrado para Gestão Ambiental Pública de Praias
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'SISPRAIA: Sistema Integrado para Gestão Ambiental Pública de Praias',
        'O invento é destinado prioritariamente à Administração Pública, tendo
em vista o próprio objetivo de criação que é atender a uma demanda latente na
gestão ambiental pública qual seja uma melhor efetividade no cumprimento de
conformidades legais em áreas costeiras. Além do âmbito municipal a que se
destina inicialmente, o produto poderá atingir a esfera estadual, sendo também
viável servir de exemplo para outras localidades do país que possuam praias.',
        'UECE',
        'SOFTWARE',
        '2022-05-30'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Francisco Edmar de Sousa Silva Pinheiro', 'Fábio Perdigão Vasconcelos', 'Otávio Augusto de Oliveira Lima Barra']::varchar[],
        'Fundação Universidade Estadual do Ceará/ Universidade Regional do Cariri',
        'O Sistema oferece interface para que usuários leigos possam realizar a
avaliação ambiental e de infraestrutura das praias. desta feita, tem por objetivo
principal ser um componente de avaliação e integração de conformidades legais,
posto a ausência de integração de elementos legais constituir-se em um desafio na
preservação e conservação das áreas litorâneas. Pretende, deste modo, ser um
componente de avaliação de desemprenho público ambiental.',
        'BR 51 2022 001300 2',
        'BR 51 2022 001300 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2022 001300 2'
          AND p.nome = 'SISPRAIA: Sistema Integrado para Gestão Ambiental Pública de Praias'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [075/242] PROGRAMA DE COMPUTADOR (Linha 72) - BR 51 2022 001172 7 - GERIS UTI
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'GERIS UTI',
        'Existem na literatura vários estudos propondo a estruturação de Protocolos de Gestão de Risco e
Análise de Diagnósticos, visando a facilitação da comunicação entre profissionais da saúde e
assistência ao paciente diferenciada de qualidade. No entanto, não há softwares específicos para
estruturação de aplicativos móveis que pudessem atender a demanda dos protocolos e analises
supracitados, com a indicação clínica de atendimento aos pacientes críticos.',
        'UECE',
        'SOFTWARE',
        '2022-05-18'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Cassio Pinheiro Oliveira', 'Henrique Jorge Maia Costa', 'Herlenia Da Penha Oliveira Cavalcante', 'Ney Rômulo de Oliveira Paula', 'Paulo Iury Pinheiro Da Rocha']::varchar[],
        'Fundação Universidade Estadual do Ceará/ Fundação Universidade Federal do Piaui',
        '-Através do invento do
software, será possível reunir todas as informações necessárias para o compartilhamento e
preenchimento das informações de forma rápida e automatizada com toda a equipe envolvida no setor
de gestão de risco e análise de diagnósticos em pacientes críticos internados em UTI, propiciando de
forma ágil e assertiva o diagnóstico e tomada de condutas para o paciente.',
        'BR 51 2022 001172 7',
        'BR 51 2022 001172 7',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2022 001172 7'
          AND p.nome = 'GERIS UTI'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [076/242] PROGRAMA DE COMPUTADOR (Linha 73) - BR 51 2022 000909 9 - LEPEN - Letramento sobre Pé Neuropático
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'LEPEN - Letramento sobre Pé Neuropático',
        'O AVA - LEPEN foi desenvolvido como uma proposta pedagógica
destinada a pessoas com pé diabético neuropático e linguagem em saúde acessível,
podendo ser acessada em navegadores de internet nos mais variados dispositivos,
como smartphones, tablet e computadores, a partir de uma plataforma livre de
educação online, conhecida como plataforma Moodle©',
        'UECE',
        'SOFTWARE',
        '2022-04-27'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Natália Aguiar Moraes Vitoriano', 'Thereza Maria Magalhães Moreira']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Seu desenvolvimento foi voltado para não haver necessidade de cadastro
prévio, podendo o usuário acessar todos os módulos do curso com o perfil no modo
visitante, podendo assim, visualizar todas as aulas quantas vezes for necessário',
        'BR 51 2022 000909 9',
        'BR 51 2022 000909 9',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2022 000909 9'
          AND p.nome = 'LEPEN - Letramento sobre Pé Neuropático'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [077/242] PROGRAMA DE COMPUTADOR (Linha 74) - BR 51 2022 000650 2 - Gestão - SAE
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Gestão - SAE',
        'Trata-se de uma tecnologia que visa orientar sobre a sistematização de enfermagem.',
        'UECE',
        'SOFTWARE',
        '2022-03-24'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Adriano Rodrigues de Sousa', 'Francisco José do Nascimento Júnior']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        NULL,
        'BR 51 2022 000650 2',
        'BR 51 2022 000650 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2022 000650 2'
          AND p.nome = 'Gestão - SAE'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [078/242] PROGRAMA DE COMPUTADOR (Linha 75) - BR 51 2022 000354 6 - App Lean Quality
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'App Lean Quality',
        'Com intuito de deixar a informação acessível na palma da
mão, o aplicativo Lean Quality traz informações como exemplos,
conceitos, vídeos que falam da metodologia Lean. Tornando-se
uma importante fonte na questão de contribuir para a implantação
do Lean nos centros de saúde.',
        'UECE',
        'SOFTWARE',
        '2022-02-17'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Francisco Leon Torres de Sousa', 'Maria Salete Bessa Jorge']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O aplicativo funcionará como uma ferramenta de consulta e
discussão com relação a metodologia Lean dentro dos centros de
saúde do município.',
        'BR 51 2022 000354 6',
        'BR 51 2022 000354 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2022 000354 6'
          AND p.nome = 'App Lean Quality'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [079/242] PROGRAMA DE COMPUTADOR (Linha 76) - BR 51 2021 003166 0 - Jogo da Memória Frutífero
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Jogo da Memória Frutífero',
        'Jogo da Memória Frutífero é um software que ensina os alunos a lerem através de um jogo da memória que traz imagens de frutas e seus respectivos nomes para que os discentes associem a palavra ao desenho. Está dividido em três níveis, os quais têm dificuldades diferentes. Os alunos vão ganhando moedas a cada acerto e podem, após finalizar o jogo da memória, comprar frutas com o dinheiro que ganhou.',
        'UECE',
        'SOFTWARE',
        '2021-12-22'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Antônia Chirlene Evangelista Ferreira', 'Carliene Jorge Da Silva', 'José Rogério de Oliveira', 'Matheus Costa Granja', 'Regina Cláudia Pinheiro']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'É um jogo para computador destinado a alunos dos anos iniciais do Ensino Fundamental cujo objetivo é a aprendizagem da leitura, por isso, deverá ser aplicado na Educação.',
        'BR 51 2021 003166 0',
        'BR 51 2021 003166 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2021 003166 0'
          AND p.nome = 'Jogo da Memória Frutífero'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [080/242] PROGRAMA DE COMPUTADOR (Linha 77) - BR 51 2021 003126 1 - App Jogo da Memória Frutífero
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'App Jogo da Memória Frutífero',
        'O App Jogo da Memória Frutífero é um software que ensina os alunos a lerem através de um jogo da memória que traz imagens de frutas e seus respectivos nomes para que os discentes associem a palavra ao desenho. Está dividido em três níveis, os quais têm dificuldades diferentes. Os alunos vão ganhando moedas a cada acerto e podem, após finalizar o jogo da memória, comprar frutas com o dinheiro que ganhou.',
        'UECE',
        'SOFTWARE',
        '2021-12-17'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Antônia Chirlene Evangelista Ferreira', 'Carliene Jorge Da Silva', 'José Rogério de Oliveira', 'Matheus Costa Granja', 'Regina Cláudia Pinheiro']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'É um aplicativo para celular destinado a alunos dos anos iniciais do Ensino Fundamental cujo objetivo é a aprendizagem da leitura, por isso, deverá ser aplicado na Educação.',
        'BR 51 2021 003126 1',
        'BR 51 2021 003126 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2021 003126 1'
          AND p.nome = 'App Jogo da Memória Frutífero'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [081/242] PROGRAMA DE COMPUTADOR (Linha 78) - BR 51 2021 002816 3 - LeVoA - Leitura para Voar sem Asas
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'LeVoA - Leitura para Voar sem Asas',
        'O LeVoA - Ler para Voar sem Asas é um jogo de trilha no qual os usuários, após ouvir a história A Festa no Céu, devem ajudar o sapo a ir a um evento pensado para os bichos que voam, pois a festa acontecerá no céu. Para tanto, os jogadores devem seguir uma trilha que leva o sapo ao céu, lendo e acertando o nome dos animais que estão escritos. Para cada acerto, ela ganha moedas que vão sendo acumuladas para dar ao sapo. Ao final, dependendo da quantidade de moedas que o usuário ganhou, o sapo pode ir para festa de drone, de balão ou de jatinho e levar alguns amigos.',
        'UECE',
        'SOFTWARE',
        '2021-11-25'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Antônia Alcilânea de Assis Oliveira', 'Antônia Chirlene Evangelista Ferreira', 'Antônio Nilberto Gonçalves de Oliveira', 'Carliene Jorge Da Silva', 'Jamile Maria Da Costa Pedrosa', 'José Rogério de Oliveira', 'Matheus Costa Granja', 'Regina Cláudia Pinheiro']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'É um programa para computador, destinado a alunos dos anos iniciais do Ensino Fundamental, cujo objetivo é a aprendizagem da leitura, por isso, deverá ser aplicado na Educação. O jogo tem interpretação em LIBRAS e áudios para garantir maior acessibilidade.',
        'BR 51 2021 002816 3',
        'BR 51 2021 002816 3',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2021 002816 3'
          AND p.nome = 'LeVoA - Leitura para Voar sem Asas'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [082/242] PROGRAMA DE COMPUTADOR (Linha 79) - BR 51 2021 001552 5 - AppLeVoA - Aplicativo Leitura para Voar sem Asas
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'AppLeVoA - Aplicativo Leitura para Voar sem Asas',
        'Aplicativo Ler para Voar sem Asas é um jogo de trilha no qual os usuários, após ouvir a história A Festa no Céu, devem ajudar o sapo a ir a um evento pensado para os bichos que voam, pois a festa acontecerá no céu. Para tanto, os jogadores devem seguir uma trilha que leva o sapo ao céu, lendo e acertando o nome dos animais que estão escritos. Para cada acerto, ela ganha moedas que vão sendo acumuladas para dar ao sapo. Ao final, dependendo da quantidade de moedas que o usuário ganha, o sapo pode ir para festa de drone, de balão ou de jatinho e levar alguns amigos.',
        'UECE',
        'SOFTWARE',
        '2021-07-08'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Antonio Nilberto Gonçalves de Oliveira', 'Antônia Alcilânea de Assis Oliveira', 'Antônia Chirlene Evangelista Ferreira', 'Carliene Jorge Da Silva', 'Jamile Maria Da Costa Pedrosa', 'José Rogério de Oliveira', 'Matheus Costa Granja', 'Regina Cláudia Pinheiro']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'É um aplicativo para celular destinado a alunos dos anos iniciais do Ensino Fundamental cujo objetivo é a aprendizagem da leitura, por isso, deverá ser aplicado na Educação. O jogo tem interpretação em LIBRAS e áudios para garantir maior acessibilidade.',
        'BR 51 2021 001552 5',
        'BR 51 2021 001552 5',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2021 001552 5'
          AND p.nome = 'AppLeVoA - Aplicativo Leitura para Voar sem Asas'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [083/242] PROGRAMA DE COMPUTADOR (Linha 80) - BR 51 2021 000604 6 - SysHidronefrose - software para estruturação de laudos de ultrassonogr
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'SysHidronefrose - software para estruturação de laudos de ultrassonografia em pacientes com dilatação do trato urinário',
        'Uso do software através dos médicos radiologistas executores do exame e pelos médicos solicitantes corroborou com a proposição de que a estruturação dos laudos facilita e otimiza a interlocução médica, a qual se faz crucial para o correto diagnóstico e manejo clínico da dilatação do trato urinário, uma das anormalidades congênitas mais comuns, proporcionando melhorias no cuidado do paciente infantil. A dilatação do trato urinário é uma das anormalidades congênitas mais comuns, detectada em ultrassonografias pré-natais em até 5% de todas as gestações. Em boa parte dos casos essa dilatação é transitória, podendo se resolver espontaneamente antes ou após o nascimento. Porém, dilatações maiores podem decorrer de fatores de obstrução ao fluxo urinário, persistir após o nascimento e ser causa de infecção urinária e dano ao parênquima renal, tornando necessária uma intervenção cirúrgica. As principais causas de dilatação do trato urinário fetal que persistem após o nascimento são estenose de junção ureteropélvica, refluxo vesicoureteral, estenose da junção ureterovesical, duplicações pieloureterais e válvula de uretra posterior. A ultrassonografia é o exame de eleição para o diagnóstico de dilatação do trato urinário, sendo o primeiro exame de imagem a ser solicitado na propedêutica urológica. A transmissão dos seus achados é feita através da emissão de laudos e pode variar de forma significativa entre os médicos realizadores do exame, dificultando a compreensão dos médicos solicitantes. Tradicionalmente, os relatórios médicos são feitos através de narrativas livres, com a utilização de terminologias diversas para expressar os mesmos achados de imagem, podendo gerar dúvidas a respeito da definição diagnóstica. Baseado nos últimos consensos da literatura médica sobre dilatação do trato urinário pediátrico, objetivou-se o desenvolvimento de um software para emissão de laudos ultrassonográficos estruturados e contextualizados para pesquisa dessa anormalidade, que otimiza a comunicação entre os médicos solicitantes e os realizadores do exame. Software para emissão de laudos ultrassonográficos estruturados.',
        'UECE',
        'SOFTWARE',
        '2021-03-29'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Harley Silveira Menezes', 'Manoel Miqueias Maia', 'Rommel Prata Regadas']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O software se mostrou útil e uma ferramenta relevante para auxiliar na interlocução médica, através da estruturação e padronização dos laudos de ultrassonografia, proporcionando melhorias no cuidado do paciente infantil com suspeita ou em acompanhamento de dilatação do trato urinário.',
        'BR 51 2021 000604 6',
        'BR 51 2021 000604 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2021 000604 6'
          AND p.nome = 'SysHidronefrose - software para estruturação de laudos de ultrassonografia em pacientes com dilatação do trato urinário'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [084/242] PROGRAMA DE COMPUTADOR (Linha 81) - BR 51 2021 000307 1 - HANDC - Software para coleta e acompanhamento da motricidade fina de p
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'HANDC - Software para coleta e acompanhamento da motricidade fina de pacientes cirróticos',
        'Software de coleta e armazenamento de dados da motricidade fina de pacientes cirróticos com e sem Encefalopatia Hepática, que combina a união de hardware e software capaz de obter do ambiente as mínimas alterações motoras de pacientes cirróticos confirmando que a condição motora fina dos pacientes com e sem EH evidente é prejudicada de acordo com o progresso da patologia, com a descompensação da cirrose e do tempo de abstinência alcoólica em detrimento do acompanhamento médico. Considera variáveis clínicas e obtém os dados da motricidade por meio de um sensor comercial denominado Leap Motion, conectado por porta USB. O sftware abre portas para novas explorações em outras pesquisas, assim como para o desenvolvimento de testes diagnósticos utilizando os dados obtidos por meio do dispositivo/hardware LMC e do software de captura. Com o suporte dos trabalhos futuros, será possível prover mais embasamento aos profissionais médicos nas métricas das condutas terapêuticas aplicadas.',
        'UECE',
        'SOFTWARE',
        '2021-02-22'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Cassio Pinheiro Oliveira', 'Francisco Sérgio Rangel de Paula Pessoa', 'José Ricardo de Figueiredo', 'Manoel Miqueias Maia']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O “HandC” operacionaliza em plataforma web e combina o armazenamento de dados informados pelo usuário e dados obtidos do ambiente por meio do LMC capaz de obter dados do ambiente percebendo as mínimas alterações motoras de pacientes cirróticos, além de apresentar dados que confirmam a prejudicação da motricidade de acordo com o progresso patológico. Software de coleta e acompanhamento desenvolvido para plataforma WEB utilizando framework Laravel 7 e Vue JS 3. Considera variáveis clínicas e obtém os dados da motricidade por meio de um sensor comercial denominado Leap Motion, conectado por porta USB.',
        'BR 51 2021 000307 1',
        'BR 51 2021 000307 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2021 000307 1'
          AND p.nome = 'HANDC - Software para coleta e acompanhamento da motricidade fina de pacientes cirróticos'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [085/242] PROGRAMA DE COMPUTADOR (Linha 82) - BR 51 2020 002500 5 - SIMON UPA: Sistema de Monitoramento das Unidades de Pronto Atendimento
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'SIMON UPA: Sistema de Monitoramento das Unidades de Pronto Atendimento',
        'Trata-se de um sistema de monitoramento das Unidade de Pronto Atendimento (UPAs). Sua
idealização se deu a partir da identificação de uma fragilidade de monitoramento das unidades
referida pelos gestores da Secretária de Saúde do Estado do Ceará (SESA), pois a mesma se
utilizava de um instrumento de coleta de informações manual. desta forma, foi idealizado um
sistema que apresentasse o instrumento de coleta das informações, bem como garantisse a
comunicação entre o coordenador da UPA e o gestor da SESA e que fosse analisado em tempo
real os relatórios gerados pela alimentação do instrumento.',
        'UECE',
        'SOFTWARE',
        '2020-11-11'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Maria Raquel Rodrigues Carvalho', 'Maria Salete Bessa Jorge']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Contribui para o processo
de tomada de decisão do gestor/gerentes referente as necessidades da gestão em saúde do
Sistema Único de Saúde. Tal tecnologia será utilizada exclusivamente pelos gestores do SUS,
desta forma seu acesso é restrito, necessitando de senha.',
        'BR 51 2020 002500 5',
        'BR 51 2020 002500 5',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2020 002500 5'
          AND p.nome = 'SIMON UPA: Sistema de Monitoramento das Unidades de Pronto Atendimento'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [086/242] PROGRAMA DE COMPUTADOR (Linha 83) - BR 51 2020 002234 0 - Melodiz
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Melodiz',
        'um estudante que não desenvolve um bom ouvido musical não tem
sequer a capacidade de afinar seu próprio instrumento sem o auxílio de ferramentas
especializadas. Outro problema, enfrentado por adeptos das ferramentas de aprimoramento
mecânico, em seu processo de estudo, é aprender novas músicas sozinho, pois, como estes não
possuem a capacidades de identificar as notas ouvidas, não conseguem encontrá-las em seu
instrumento. Esta dificuldade os leva a ter um repertório reduzido, adquirido de terceiros, sem
uma garantia da precisão desse material. Neste âmbito, apresenta-se neste aplicativo uma
solução capaz de oferecer desafios com uma planejada progressão de dificuldade a fim de testar
e treinar a habilidade de percepção musical do usuário, para que este tenha condições de
identificarnotas, intervalos e instrumentos musicais com mais facilidade em suas práticas
musicais.',
        'UECE',
        'SOFTWARE',
        '2020-10-19'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Thiago Dias de Carvalho Quaresma Gama']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O aplicat9vo possui quatro níveis desbloqueáveis pelo usuário (iniciante,
intermediário, avançado e bônus), ocupa pouco espaço no aparelho celular (5,17 MB) e modo de
jogo off-line.',
        'BR 51 2020 002234 0',
        'BR 51 2020 002234 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2020 002234 0'
          AND p.nome = 'Melodiz'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [087/242] PROGRAMA DE COMPUTADOR (Linha 84) - BR 51 2020 002212 0 - HELP FERIDAS - TECNOLOGIA M-HEALT PARA PREVENÇÃO E CUIDAdoS de PESSOAS
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'HELP FERIDAS - TECNOLOGIA M-HEALT PARA PREVENÇÃO E CUIDAdoS de PESSOAS COM FERIDAS',
        'Será utilizado por pessoas que cuidam de pacientescom feridas.',
        'UECE',
        'SOFTWARE',
        '2020-10-16'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Maria Cláudia Carneiro Pinto', 'Maria Salete Bessa Jorge']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'As pessoas que utilizarem o aplicativo terão
orientações sobre o cuidado, podendo evitar complicações.',
        'BR 51 2020 002212 0',
        'BR 51 2020 002212 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2020 002212 0'
          AND p.nome = 'HELP FERIDAS - TECNOLOGIA M-HEALT PARA PREVENÇÃO E CUIDAdoS de PESSOAS COM FERIDAS'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [088/242] PROGRAMA DE COMPUTADOR (Linha 85) - BR 51 2020 002020 8 - STONEFLUX
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'STONEFLUX',
        'O aplicativo tem como objetivo ajudar médicos não urologistas a identificar pacientes com cálculo renal e encaminhar para o tratamento adequado de acordo com suas caracteristicas.',
        'UECE',
        'SOFTWARE',
        '2020-09-28'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Humberto de Holanda Madeira Barros', 'Manoel Miqueias Maia', 'Rommel Prata Regadas']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Essa tecnologia ajuda a agilizar o tratamento e diminui os riscos de infecções graves e insuficiência renal.',
        'BR 51 2020 002020 8',
        'BR 51 2020 002020 8',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2020 002020 8'
          AND p.nome = 'STONEFLUX'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [089/242] PROGRAMA DE COMPUTADOR (Linha 86) - BR 51 2020 001816 5 - Pde: Predição de demanda Elástica
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Pde: Predição de demanda Elástica',
        'Atualmente, os Provedores de Internet (ISPs) tendem a evoluir para Provedores de Internet Modernos (MISPs), a fim de lidar com situações como a demanda elástica de recursos de rede que podem causar queda na Qualidade de Serviço (QoS). Uma abordagem promissora para lidar com demanda elástica é o uso de técnicas de previsão de tráfego. Contudo, tais técnicas não atingem fatores de correção necessários quando o comportamento da rede não segue um padrão claro (como nas situações de demanda elástica).',
        'UECE',
        'SOFTWARE',
        '2020-09-04'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Dyego Henrique Leonel Oliveira', 'Rafael Lopes Gomes']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Apresenta-se uma ferramenta com um modelo adaptável de previsão de rede para MISPs, que ajusta sazonalidade e tendência e remove os ciclos de erro na série temporal de acordo com o comportamento observado no tráfego de rede.',
        'BR 51 2020 001816 5',
        'BR 51 2020 001816 5',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2020 001816 5'
          AND p.nome = 'Pde: Predição de demanda Elástica'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [090/242] PROGRAMA DE COMPUTADOR (Linha 87) - BR 51 2020 001794 0 - DAAI: detecção de Anomalias em Ambientes Inteligentes
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'DAAI: detecção de Anomalias em Ambientes Inteligentes',
        'Ambientes inteligentes são compostos por diversos dispositivos de IoT e de usuários finais (notebooks, tablets, etc), os quais comunicam-se entre si e com a Internet. Dispositivos de Internet das coisas (IoT) podem ter comportamento anômalo (funcionamento fora do padrão), devido vulnerabilidades de segurança ou mal funcionamento. Monitorar o comportamento destes dispositivos torna-se crucial para garantir um desempenho eficiente da rede.',
        'UECE',
        'SOFTWARE',
        '2020-09-02'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Diego Alysson Moreira', 'Humberto Pires Marques', 'Rafael Lopes Gomes']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A ferramenta desenvolvida, chamada DAAI: detecção de Anomalias em Ambientes Inteligentes, visa, a partir do monitoramento do tráfego de rede, detectar de anomalias em ambientes inteligentes baseado em Inteligência Artificial (IA), gerando um perfil da rede e detectando possíveis anomalias através de um comportamento de tráfego fora do padrão previsto.',
        'BR 51 2020 001794 0',
        'BR 51 2020 001794 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2020 001794 0'
          AND p.nome = 'DAAI: detecção de Anomalias em Ambientes Inteligentes'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [091/242] PROGRAMA DE COMPUTADOR (Linha 88) - BR 51 2020 001793 2 - HCM: Huffman Compression for Microcontrollers
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'HCM: Huffman Compression for Microcontrollers',
        'Recentemente a era da Internet das Coisas Industrial (IIoT) emergiu a fim de garantir a produção eficiente e sustentável para o contexto de Industria 4.0. Uma abordagem promissora para implantar ambientes IIoT é o uso da tecnologia IEEE 802.11 como forma de comunicação sem fio. Contudo, a configuração usual da tecnologia IEEE 802.11 resulta em maior consumo de energia dos microcontroladores IIoT, devido ao tamanho dos pacotes transmitidos.',
        'UECE',
        'SOFTWARE',
        '2020-09-02'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Marcus de Vasconcelos Diogo Silva', 'Rafael Lopes Gomes']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Apresenta-se uma ferramenta de compressão para atuar nos microcontroladores, visando reduzir a quantidade de dados a serem transmitidos e, consequentemente, minimizar o consumo de energia dos microcontroladores nesses cenários.',
        'BR 51 2020 001793 2',
        'BR 51 2020 001793 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2020 001793 2'
          AND p.nome = 'HCM: Huffman Compression for Microcontrollers'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [092/242] PROGRAMA DE COMPUTADOR (Linha 89) - BR 51 2019 002632 2 - Heterogeneous Wireless Channels Assigner
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Heterogeneous Wireless Channels Assigner',
        'O programa é capaz de encontrar uma configuração de canais utilizados pelos pontos de acesso que minimiza a interferência sofrida pelos dispositivos conectados aos mesmos. A especificação dos padrões que definem as tecnologias de comunicação wifi, zigbee e bluetooth respectivamente não apresenta um padrão para realizar a conexão dos clientes aos pontos de acesso nem como os diferentes dispositivos irão compartilhar os canais de comunicação disponíveis. Em via disso é comum que os produtos vendidos no mercado venham com um canal pré-definido, o que pode acarretar em muitos dispositivos utilizando o mesmo canal degradando o desempenho da rede. Adicionalmente a isso a conexão dos clientes aos pontos de acesso normalmente é feita considerando-se apenas a força do sinal o que torna o uso da rede desbalanceado conforme o número de dispositivos aumenta.',
        'UECE',
        'SOFTWARE',
        '2019-11-19'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Gabriel Galdino Da Silva', 'Joaquim Celestino Júnior', 'Rafael Lopes Gomes']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O programa em questão é capaz de evitar a sobrecarga dos pontos de acesso bem como atribuir canais aos mesmos de forma a maximizar a performance da rede em ambientes inteligentes.',
        'BR 51 2019 002632 2',
        'BR 51 2019 002632 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2019 002632 2'
          AND p.nome = 'Heterogeneous Wireless Channels Assigner'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [093/242] PROGRAMA DE COMPUTADOR (Linha 90) - BR 51 2019 001834 6 - LETRA LIVRE 2.0
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'LETRA LIVRE 2.0',
        'A versão 2.0 do Letra Livre é um software educativo livre que se caracteriza pelo uso da atividade gamificada de escrita a partir da interpretação visual e sonora.',
        'UECE',
        'SOFTWARE',
        '2019-08-22'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Amanda Maria domingos de Oliveira', 'dennys Leite Maia', 'Isis Ramona Medeiros Da Cunha', 'Joserlene Lima Pinheiro', 'José Veríssimo do Nascimento Filho', 'João Batista Carvalho Nunes', 'Maria Lucimara Rodrigues Da Silva Cruz']::varchar[],
        'Fundação Universidade Estadual do Ceará/ Universidade Federal do Rio Grande do Norte',
        'O Letra Livre 2.0 é uma aplicação Java para desktop e foi desenvolvida seguindo partes da metodologia SCRUM. Esta experiência mostra uma das vantagens em desenvolver recursos que estejam dentro da cultura livre, o que oportuniza, a outros desenvolvedores ou usuários, melhorá-los e adequá-los a outras realidades.',
        'BR 51 2019 001834 6',
        'BR 51 2019 001834 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2019 001834 6'
          AND p.nome = 'LETRA LIVRE 2.0'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [094/242] PROGRAMA DE COMPUTADOR (Linha 91) - BR 51 2019 001504 5 - Trat-C
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Trat-C',
        'A hepatite crônica pelo vírus da hepatite “C” (HCVC) acomete aproximadamente 180 milhões de pessoas em todo o mundo, sendo aproximadamente um milhão no Brasil. A doença pode evoluir de forma silenciosa por vários anos, culminando com cirrose hepática e/ou carcinoma hepatocelular, constituindo a causa mais frequente de indicação de transplante hepático. O tratamento da HCVC evoluiu nos últimos 25 anos. Os esquemas iniciais eram complexos, repletos de efeitos colaterais e utilizavam drogas injetáveis por um ano de tratamento, com cura em apenas 45% dos casos. Os novos esquemas de tratamento utilizam drogas de fácil manipulação, administradas por via oral, usadas por apenas três a seis meses, isentas de paraefeitos graves e permitem cura de aproximadamente 95% dos casos. A evolução nefasta da doença e os custos aos sistemas de saúde podem ser prevenidos, dentre outras estratégias, pelo tratamento do maior número de pacientes possível. Para tanto, é fundamental que o maior número de médicos, hepatologistas ou não, sejam treinados para uso do atual tratamento da HCVC no Brasil. Pensando nisso foi desenvolvido um software, sob forma de app, direcionado a estudantes de medicina, médicos em treinamento e médicos não-especialistas que possibilita a orientação rápida e eficiente, em sequência algorítmica, quanto ao melhor esquema terapêutico para um portador de HCVC, embasada pelos Protocolos Clínicos e Diretrizes Terapêuticas para Hepatite “C” e Coinfecções - PCDT 2019 do Ministério da Saúde do Brasil.',
        'UECE',
        'SOFTWARE',
        '2019-07-16'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Francisco Sérgio Rangel de Paula Pessoa']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O app TRAT-C 2019 é uma ferramenta biotecnológica inédita, simples, de fácil utilização e eficiente na definição do melhor esquema terapêutico para HCVC servindo, também, de modelo para desenvolvimento de outros processos biotecnológicos baseados em cascatas algorítmicas para decisões terapêuticas.',
        'BR 51 2019 001504 5',
        'BR 51 2019 001504 5',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2019 001504 5'
          AND p.nome = 'Trat-C'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [095/242] PROGRAMA DE COMPUTADOR (Linha 92) - BR 51 2019 001143 0 - Mecanismo online de Criação de Questões: MOCQ
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Mecanismo online de Criação de Questões: MOCQ',
        'A área de aplicação do software consiste na Educação a distância, voltado para produção de conteúdo de cursos online. Com o software é possível criar banco de questões para aplicação de provas online por meio de uma interface web.
O problema a ser resolvido consiste na alta demanda por criação e implantação de provas online por meio de banco de questões encaminhado em formado de arquivo de documento (doc), criando a demanda por um processo de implantação na interface do Ambiente Virtual de Aprendizagem Moodle. A implantação dos bancos é feita por equipe técnica que faz a leitura do documento e cria o banco de questões no Moodle.',
        'UECE',
        'SOFTWARE',
        '2019-06-11'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Francisco Wkerlyson Pereira Batista', 'Igor Lima Rodrigues', 'Maria Wilda Fernandes Felipe', 'Wosley Mendes Rocha']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A vantagem da tecnologia permitiu empoderar os elaboradores de questão de um sistema para criação dos itens das provas com a passibilidade de exportação em formato GIFT, compatível com o Ambiente Virtual de Aprendizagem Moodle.
Os mercados a serem atingidos são relacionados a todos que utilizam o Ambiente Moodle na criação de bancos de questões para aplicação de provas online para cursos a distância.',
        'BR 51 2019 001143 0',
        'BR 51 2019 001143 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2019 001143 0'
          AND p.nome = 'Mecanismo online de Criação de Questões: MOCQ'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [096/242] PROGRAMA DE COMPUTADOR (Linha 93) - BR 51 2019 000446 9 - OBAMA - Objetos de Aprendizagem para Matemática
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'OBAMA - Objetos de Aprendizagem para Matemática',
        'OBAMA é uma catalogação de OA classificados a partir de critérios pedagógicos e técnicos, com conteúdos explorados e habilidades que podem ser desenvolvidas em plataformas de funcionamento diferentes (desktop ou mobile).',
        'UECE',
        'SOFTWARE',
        '2019-03-14'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Amanda Maria domingos de Oliveira', 'Ana Cláudia Nunes Silva', 'Clésia Jordânia Nunes Da Costa', 'Danilo do Carmo de Souza', 'dennys Leite Maia', 'Débora Karoline Silva de Azevedo', 'Elvis Medeiros de Melo', 'Francisca Wellingda Leal Da Silva', 'Joserlene Lima Pinheiro', 'Marcilia Chagas Barreto', 'Maria Luziene Da Silva Azevedo Bandeira', 'Nassara Maia Cabral Cardoso Gomes', 'Nelson Ion de Oliveira', 'Paulo César Da Silva Batista', 'Rodolfo Araújo de Carvalho', 'Rodrigo Rodrigues Melo de Lima', 'Samuel Dantas Batista']::varchar[],
        'Fundação Universidade Estadual do Ceará/ Universidade Federal do Rio Grande do Norte',
        'Além do desenvolvimento do repositório para ajudar professores da Educação Básica a encontrar recursos educativos digitais para diversificar as estratégias de ensino de Matemática em sala de aula, a OBAMA intenciona formar docentes para a busca, utilização e integração dos OA em processos de ensino e aprendizagem.',
        'BR 51 2019 000446 9',
        'BR 51 2019 000446 9',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2019 000446 9'
          AND p.nome = 'OBAMA - Objetos de Aprendizagem para Matemática'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [097/242] PROGRAMA DE COMPUTADOR (Linha 94) - BR 51 2018 000198 0 - SisAcadPG - Sistema de Gestão Acadêmica para Pós-Graduação
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'SisAcadPG - Sistema de Gestão Acadêmica para Pós-Graduação',
        'Sistema Acadêmico para gerenciar os cursos
de Pós-graduação',
        'UECE',
        'SOFTWARE',
        '2018-02-16'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Diogo Aguiar Lima', 'Guilherme Lima Façanha', 'Mariela Inés Cortes']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O sistema permite organizar, gerenciar e manter de forma segura e eficaz os dados cadastrais e acadêmicos dos discentes da Pós-Graduação da UECE.',
        'BR 51 2018 000198 0',
        'BR 51 2018 000198 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2018 000198 0'
          AND p.nome = 'SisAcadPG - Sistema de Gestão Acadêmica para Pós-Graduação'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [098/242] PROGRAMA DE COMPUTADOR (Linha 95) - BR 51 2017 001163 0 - BE-SYS: SISTEMA E-HEALTH EM BIG-DATA PARA ANÁLISE E deTECÇÃO de RISCO 
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'BE-SYS: SISTEMA E-HEALTH EM BIG-DATA PARA ANÁLISE E deTECÇÃO de RISCO de CHOQUE SÉPTICO EM PACIENTES ADULTOS',
        NULL,
        'UECE',
        'SOFTWARE',
        '2017-08-29'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Francisco Leonardo Jales Martins', 'Joaquim Celestino Júnior']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        NULL,
        'BR 51 2017 001163 0',
        'BR 51 2017 001163 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2017 001163 0'
          AND p.nome = 'BE-SYS: SISTEMA E-HEALTH EM BIG-DATA PARA ANÁLISE E deTECÇÃO de RISCO de CHOQUE SÉPTICO EM PACIENTES ADULTOS'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [099/242] PROGRAMA DE COMPUTADOR (Linha 96) - BR 51 2017 001162 1 - SIMTOPOLOGY: UM SIMULAdoR de REde PARA TESTES de PROTOCOLOS
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'SIMTOPOLOGY: UM SIMULAdoR de REde PARA TESTES de PROTOCOLOS',
        NULL,
        'UECE',
        'SOFTWARE',
        '2017-08-29'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Daniel Sucupira Lima', 'Filipe Ferandes dos Santos Brasil de Matos', 'Fábio de Souza Cerqueira', 'Joaquim Celestino Júnior', 'José Henrique Brandao Neto', 'João Gonçalves Filho', 'Manuel Rui Pessoa de Paula', 'Silvio Roberto Martins Amarante']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        NULL,
        'BR 51 2017 001162 1',
        'BR 51 2017 001162 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2017 001162 1'
          AND p.nome = 'SIMTOPOLOGY: UM SIMULAdoR de REde PARA TESTES de PROTOCOLOS'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [100/242] PROGRAMA DE COMPUTADOR (Linha 97) - BR 51 2017 001161 3 - SONA: ARQUITETURA PARA FATIAMENTO de REdeS ÓPTICAS deFINIDAS POR SOFTW
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'SONA: ARQUITETURA PARA FATIAMENTO de REdeS ÓPTICAS deFINIDAS POR SOFTWARE',
        NULL,
        'UECE',
        'SOFTWARE',
        '2017-08-29'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Joaquim Celestino Júnior', 'Tiago Portela de Souza']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        NULL,
        'BR 51 2017 001161 3',
        'BR 51 2017 001161 3',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2017 001161 3'
          AND p.nome = 'SONA: ARQUITETURA PARA FATIAMENTO de REdeS ÓPTICAS deFINIDAS POR SOFTWARE'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [101/242] PROGRAMA DE COMPUTADOR (Linha 98) - BR 51 2017 001160 5 - MIB YANG do OTN-SWITCH
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'MIB YANG do OTN-SWITCH',
        NULL,
        'UECE',
        'SOFTWARE',
        '2017-08-29'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Jefferson Gomes de Alcântara', 'Joaquim Celestino Júnior']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        NULL,
        'BR 51 2017 001160 5',
        'BR 51 2017 001160 5',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2017 001160 5'
          AND p.nome = 'MIB YANG do OTN-SWITCH'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [102/242] PROGRAMA DE COMPUTADOR (Linha 99) - BR 51 2017 001159 1 - TPCREATOR - UMA FERRAMENTA PARA CRIAÇÃO de TOPOLOGIA NO OPEN STACK
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'TPCREATOR - UMA FERRAMENTA PARA CRIAÇÃO de TOPOLOGIA NO OPEN STACK',
        'O TPCreator (Topology Creator) é uma ferramenta de emulação de redes SDN de forma que seja possível criar os host dentro de uma nuvem. Cada host pode executar um sistema operacional qualquer (e.g. Windowa, Linux, etc) e ser interligado utilizando-se o Open Vswitch, que é o Switch de referência Openflow.',
        'UECE',
        'SOFTWARE',
        '2017-08-29'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Bruno Lopes Alcântara Batista', 'Filipe Ferandes dos Santos Brasil de Matos', 'Joaquim Celestino Júnior', 'João Gonçalves Filho']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        NULL,
        'BR 51 2017 001159 1',
        'BR 51 2017 001159 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2017 001159 1'
          AND p.nome = 'TPCREATOR - UMA FERRAMENTA PARA CRIAÇÃO de TOPOLOGIA NO OPEN STACK'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [103/242] PROGRAMA DE COMPUTADOR (Linha 100) - BR 51 2017 000815 9 - SOMATOCALC
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'SOMATOCALC',
        'O aplicativo SomatoCal foi desenvolvido em forma de aplicação acessível em celular e tablet, utilizando a plataforma Android, que foi escolhida por ser uma excelente ferramenta inteiramente livre, de código aberto e considerada uma referência tecnológica no que se diz respeito à mobilidade.',
        'UECE',
        'SOFTWARE',
        '2017-07-06'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['André Acciolly Nogueira Machado', 'André Alves Maia', 'Christina Pacheco Santos Martin', 'Francisco Sergio Lopes Vasconcelos Filho', 'João Filho Freire Lopes', 'Paula Matias Soares', 'Roberta Cristina Da Rocha E Silva', 'Welton Daniel Nogueira Godinho']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'É um aplicativo que permite ao usuário efetuar avaliações de seu biotipo e percentual de gordura corporal através de seus dados anatômicos.',
        'BR 51 2017 000815 9',
        'BR 51 2017 000815 9',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2017 000815 9'
          AND p.nome = 'SOMATOCALC'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [104/242] PROGRAMA DE COMPUTADOR (Linha 101) - BR 51 2016 001737 6 - UP SOFTWARE
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'UP SOFTWARE',
        NULL,
        'UECE',
        'SOFTWARE',
        '2016-12-16'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['João Paulo Camelo Menezes']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        NULL,
        'BR 51 2016 001737 6',
        'BR 51 2016 001737 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2016 001737 6'
          AND p.nome = 'UP SOFTWARE'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [105/242] PROGRAMA DE COMPUTADOR (Linha 102) - BR 51 2015 001228 2 - GENE COLLECTOR
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'GENE COLLECTOR',
        'Gene Collector foi concebido para o uso por pesquisadores e estudantes das Ciências da Vida, para que possam coletar informações disponíveis em dois dos principais bancos de dados biológicos: NCBI Gene e Ensembl Genome Browser, com maior facilidade e rapidez.',
        'UECE',
        'SOFTWARE',
        '2015-10-28'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Antonio Almir Araujo Neto', 'Christina Pacheco Santos Martin', 'Jhony Lucas Cavalcante Da Silva', 'Juliana Osório Alves', 'Milca Magalhães Dias de Carvalho Soares', 'Renato Pedrosa Vasconcelos', 'Samuel Gonçalves Lopes', 'Stela Mirla Da Silva Felipe', 'Vânia Marilande Ceccatto', 'Willyane de Paiva Silva']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Com o programa Gene Collector, o usuário pode reunir diversas informações sobre um conjunto de genes, como localização, símbolo oficial, sinônimos, nome oficial e tipo de produto gênico, com a opção de buscar os dados nos bancos de dados NCBI gene, Ensembl ou ambos. Uma síntese de alguns dados obtidos também é produzida para fornecer uma visão geral do conjunto de genes avaliado.',
        'BR 51 2015 001228 2',
        'BR 51 2015 001228 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2015 001228 2'
          AND p.nome = 'GENE COLLECTOR'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [106/242] PROGRAMA DE COMPUTADOR (Linha 103) - BR 51 2015 001227 4 - APP DNAQUIZ: RECURSO DIDÁTICO PARA O ENSINO de BIOLOGIA MOLECULAR
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'APP DNAQUIZ: RECURSO DIDÁTICO PARA O ENSINO de BIOLOGIA MOLECULAR',
        'O DNAQuiz é um jogo de perguntas e
respostas em informações cuidadosamente arranjadas, para dispositivos móveis,
especialmente celular e tablets.',
        'UECE',
        'SOFTWARE',
        '2015-10-28'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Hristina Pacheco Santos Martin', 'Juliana Osório Alves', 'Lucas Lima Vieira', 'Paula Matias Soares', 'Stela Mirla Da Silva Felipe', 'Vânia Marilande Ceccatto', 'Ângelo Filipe do Amaral Acácio']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'ua utilização propõe facilitar o aprendizado e tornar o ensino
mais dinâmico, aumentar o interesse pela temática Biologia Molecular, auxiliando, dessa
forma, o processo de ensino-aprendizagem.',
        'BR 51 2015 001227 4',
        'BR 51 2015 001227 4',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2015 001227 4'
          AND p.nome = 'APP DNAQUIZ: RECURSO DIDÁTICO PARA O ENSINO de BIOLOGIA MOLECULAR'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [107/242] PROGRAMA DE COMPUTADOR (Linha 104) - BR 51 2015 001112 0 - SISTEMA de EVENTOS - SISEVENTOS
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'SISTEMA de EVENTOS - SISEVENTOS',
        'Gerenciamento de todas as informações e
inscrições de um evento em um ambiente on-line
centralizado e Oferece um ambiente
computacional único e padronizado para o
gerenciamento de eventos abertos ao público
com participação da UECE.',
        'UECE',
        'SOFTWARE',
        '2015-10-01'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Luanna Alves Falcão', 'Maria Wilda Fernandes Felipe', 'Pablo Bruno de Moura Nóbrega']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Alinhar as necessidades de negócio às boas práticas de sustentabilidade ambiental, através da economia de recursos naturais; permitir o gerenciamento de todas as informações e inscrições de um evento em um ambiente on-line centralizado; oferecer um ambiente computacional único e padronizado para o gerenciamento de eventos abertos ao público, possibilitando personalizar automaticamente o skin (esquema de cores) das páginas, fontes, tabelas e imagens; gerenciar inscrições em palestras, mini-cursos, oficinas, seminários e submissão de trabalhos científicos de forma eletrônica nos eventos; e permitir a emissão de certificados on-line, a geração automática de anais do evento, a visualização de relatórios, etc',
        'BR 51 2015 001112 0',
        'BR 51 2015 001112 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2015 001112 0'
          AND p.nome = 'SISTEMA de EVENTOS - SISEVENTOS'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [108/242] PROGRAMA DE COMPUTADOR (Linha 105) - 12679-2 - AVALERE
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'AVALERE',
        'Gerenciamento de processos avaliativos
por meio de interface web através de
um aplicativo capaz de manipular
formulários genéricos de avaliação,
com aplicabilidade a diversos contextos.',
        'UECE',
        'SOFTWARE',
        '2011-11-16'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Antono Germano Magalhães Junior', 'Antônio Márcio Sousa Martins', 'Hélio Augusto Sabóia Moura', 'Igor Lima Rodrigues', 'Marcius Gomes Brandão', 'Maria Wilda Fernandes Felipe']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'o sistema funciona através de modulos, que são gerenciados da seguinte forma: Gestão de instrumentos de avaliação; Audiência; Relatórios e Análises; e Coleta de Dados; e dispor de um aplicativo capaz de gerenciar processos de avaliação genéricos, com aplicabilidade a diversos contextos que demandem avaliação.',
        '12679-2',
        '12679-2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = '12679-2'
          AND p.nome = 'AVALERE'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [109/242] PROGRAMA DE COMPUTADOR (Linha 106) - 12383-2 - GERENCIAdoR de deMANDAS E OFERTAS TECNOLÓGICAS - doT
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'GERENCIAdoR de deMANDAS E OFERTAS TECNOLÓGICAS - doT',
        'O sistema foi desenvolvido para atender a
todas as instituições parceiras da REdeNIT-CE para divulgar
suas invenções para as demandas das empresas.',
        'UECE',
        'SOFTWARE',
        '2011-09-30'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Luiz Eduardo dos Santos Tavares', 'Maria Clara Sidou Monteiro', 'Rodrigo Gato Távora']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Todo o processo é respaldado pela segurança dos dados oferecida pela
Rede, além do termo de confidencialidade que deve ser assinado
pela empresa, assegurando ao pesquisador que as informações
sobre suas pesquisas não serão divulgadas.',
        '12383-2',
        '12383-2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = '12383-2'
          AND p.nome = 'GERENCIAdoR de deMANDAS E OFERTAS TECNOLÓGICAS - doT'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [110/242] PROGRAMA DE COMPUTADOR (Linha 107) - 08860-6 - HEMOÇÃO
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'HEMOÇÃO',
        NULL,
        'UECE',
        'SOFTWARE',
        '2008-05-20'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Diana Magalhães de Oliveira', 'Italo Moreira Campelo Maia', 'Marcilia Pinheiro Da Costa', 'Michely Correia Diniz', 'Raniery Memória Alves', 'Átila Correia Cunha']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        NULL,
        '08860-6',
        '08860-6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = '08860-6'
          AND p.nome = 'HEMOÇÃO'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [111/242] PROGRAMA DE COMPUTADOR (Linha 108) - 08859-0 - PHYLOTREE
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'PHYLOTREE',
        NULL,
        'UECE',
        'SOFTWARE',
        '2008-05-20'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Ana Luiza Bessa de Paula Barros', 'Diana Magalhães de Oliveira', 'Gerardo Valdisio Rodrigues Viana', 'Italo Moreira Campelo Maia', 'Tariana Mara Fernandes Batista']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        NULL,
        '08859-0',
        '08859-0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = '08859-0'
          AND p.nome = 'PHYLOTREE'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [112/242] PROGRAMA DE COMPUTADOR (Linha 109) - BR 51 2019 002598 9 - Cardio Health
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Cardio Health',
        'O sistema Cardio Health, ao receber dados de entrada biomédicas, é capaz de classificar com alta acurácia as doenças presentes em cada conjunto de padrões dos pacientes. Para a detecção de anomalias cardíacas, o sistema utiliza o sinal ECG gerado em exames de eletrocardiograma, enquanto que para a detecção de sepse é usado um conjunto de sinais biológicos, temperatura, frequência respiratória, pressão arterial, frequência cardíaca, saturação do oxigênio sanguínea. Para realizar a classificação destas doenças, recebe-se o conjunto de atributos de um paciente como entrada e ao serem processadas através de máquinas de aprendizagem',
        'UECE',
        'SOFTWARE',
        '2019-11-14'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Diego Alysson Braga Moreira', 'Joaquim Celestino Júnior', 'Rafael Lopes Gomes']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Como resultado das classificações de um período de sinais dos pacientes, armazenados em diferentes blocos, têm-se o estado de saúde referente às anomalias observadas, caso o paciente está totalmente saudável ou com alguma anomalia. Podem ser verificados um único bloco, ou um conjunto de blocos de cada paciente.',
        'BR 51 2019 002598 9',
        'BR 51 2019 002598 9',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2019 002598 9'
          AND p.nome = 'Cardio Health'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [113/242] PROGRAMA DE COMPUTADOR (Linha 110) - BR 51 2019 001848 6 - BRINCÁLCULO
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'BRINCÁLCULO',
        'A Matemática apresenta dificuldades no ensino e na aprendizagem por toda Educação Básica. Motivados por esta realidade, desenvolveu-se o software educativo Brincálculo para alunos dos anos iniciais do Ensino Fundamental.',
        'UECE',
        'SOFTWARE',
        '2019-08-23'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Amanda Maria domingos de Oliveira', 'dennys Leite Maia', 'Dilberto Chaves Lima', 'Fabiana de Souza Marinheiro', 'Gardner de Andrade Arrais', 'Gutemberg dos Santos Chaves', 'Isis Ramona Medeiros Da Cunha', 'Jales Anderson de Assis Monteiro', 'Jean Lopes Ordéas Nascimento', 'Kamilla de Oliveira Pinheiro', 'Manoel Messias de Barros Junior', 'Maria Clara Souza de Fontes Pereira', 'Priscila Lauren dos Santos Linhares', 'Renan Bezerra Kimura', 'Rodolfo Araújo de Carvalho', 'Rodrigo Rodrigues Melo de Lima']::varchar[],
        'Fundação Universidade Estadual do Ceará/ Universidade Federal do Rio Grande do Norte',
        'O software educativo se caracteriza pelo uso de operações matemáticas aditivas e multiplicativas em três atividades que exploram o contexto de brinquedos clássicos, além de ter sido desenvolvido com a ferramenta Gdevelop.',
        'BR 51 2019 001848 6',
        'BR 51 2019 001848 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2019 001848 6'
          AND p.nome = 'BRINCÁLCULO'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- [114/242] PROGRAMA DE COMPUTADOR (Linha 111) - BR 51 2019 001845 1 - Conta Kg
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Conta Kg',
        'O software Conta Kg Bilíngue é um recurso educativo desenvolvido para auxiliar a aprendizagem matemática nos campos da probabilidade e estatística por estudantes surdos e ouvintes.',
        'UECE',
        'SOFTWARE',
        '2019-08-23'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Amanda Maria domingos de Oliveira', 'Carlos Matheus Souza Viana', 'dennys Leite Maia', 'Débora Karoline Silva de Azevedo', 'Francisca Wellingda Leal Da Silva', 'Gabriel Vieira Barreto', 'Gardner de Andrade Arrais', 'Gelly Viana Mota', 'Hagliberto Alves de Oliveira', 'Henrique Maraschin Granja', 'Lucas de Medeiros Ferreira', 'Luís Eduardo Anunciado Silva', 'Mikaella Baracho Ferreira', 'Rafaela de Fatima Santos Da Silva', 'Samuel Dantas Batista', 'Thaian Assis de Moraes']::varchar[],
        'Fundação Universidade Estadual do Ceará/ Universidade Federal do Rio Grande do Norte',
        'O recurso tem todo o seu conteúdo informativo apresentado em duas línguas: Português e Libras.',
        'BR 51 2019 001845 1',
        'BR 51 2019 001845 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 51 2019 001845 1'
          AND p.nome = 'Conta Kg'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PROGRAMA_COMPUTADOR' FROM nova_protecao;

-- =============================================================================
-- 3. ABA: DESENHO INDUSTRIAL (6 registros)
-- =============================================================================

-- [115/242] DESENHO INDUSTRIAL (Linha 2) - BR 30 2025 007950 0 - ViraVolta
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'ViraVolta',
        'O ViraVolta usa um design visual com cartas numeradas de 0 a 20, diferenciadas por cores (verde para ímpares, vermelha para pares) para facilitar a associação de números. Cada carta também inclui sinais de Libras, promovendo um aprendizado bilíngue e acessível. O design é totalmente original, criado com softwares gráficos, garantindo uma identidade visual única e eficaz para a aprendizagem matemática.',
        'UECE',
        'DESENHO_INDUSTRIAL',
        '2025-11-24'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Evely Nascimento Pinheiro', 'Samily Vandecir Maia', 'Letícia Soares da Silva', 'Michela Campos Abreu', 'Leonardo Alves Ferreira']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O grande diferencial do ViraVolta é a integração de Libras em cada carta, tornando o jogo bilíngue e acessível. Além disso, o jacaré estilizado ajuda a representar os conceitos de "maior que", "menor que" e "igual a", de forma lúdica e intuitiva. A combinação de cores e símbolos facilita o aprendizado, tornando o jogo inclusivo e inovador.',
        'BR 30 2025 007950 0',
        'BR 30 2025 007950 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        (SELECT id_game FROM public.jogos WHERE LOWER(nome) IN ('vira volta', 'viravolta') ORDER BY id_game LIMIT 1)
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 30 2025 007950 0'
          AND p.nome = 'ViraVolta'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'DESENHO_INDUSTRIAL' FROM nova_protecao;

-- [116/242] DESENHO INDUSTRIAL (Linha 3) - BR 30 2025 004817 6 - Portal web epidemiológico: ferramenta para a tomada de decisão
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Portal web epidemiológico: ferramenta para a tomada de decisão',
        'O Portal Web Epidemiológico é uma ferramenta digital voltada para a gestão em saúde pública, desenvolvida para apoiar tomadores de decisão em secretarias municipais de saúde. Sua concepção de desenho industrial está centrada nas interfaces gráficas (layouts de tela de dispositivo), que organizam de forma visual, clara e funcional as informações epidemiológicas.',
        'UECE',
        'DESENHO_INDUSTRIAL',
        '2025-07-29'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Francisco das Chagas Dourado de Barros', 'Thereza Maria Magalhães Moreira', 'Adriano Rodrigues de Souza']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O diferencial tecnológico do Portal Web Epidemiológico está na interface gráfica inovadora e na organização inteligente dos dados. O layout das telas foi desenvolvido com princípios de design centrado no usuário, o que garante uma experiência visual agradável, informativa e de rápida compreensão.
Diferente de sistemas convencionais que exigem conhecimento técnico avançado, o portal apresenta painéis personalizáveis, visualização de dados em tempo real e acesso simplificado às informações críticas, eliminando a fragmentação de dados e facilitando o planejamento de ações de saúde.',
        'BR 30 2025 004817 6',
        'BR 30 2025 004817 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 30 2025 004817 6'
          AND p.nome = 'Portal web epidemiológico: ferramenta para a tomada de decisão'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'DESENHO_INDUSTRIAL' FROM nova_protecao;

-- [117/242] DESENHO INDUSTRIAL (Linha 4) - BR 30 2024 006940 5 - Conhecimento e inclusão: desvendando o Transtorno do Espectro Autista
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Conhecimento e inclusão: desvendando o Transtorno do Espectro Autista',
        'O jogo educativo contém 50 perguntas e respostas sobre o Transtorno do Espectro Autista (TEA), direcionado a profissionais da educação, cuidadores, pais e interessados no tema. Ele oferece informações conceituais e práticas sobre o TEA, com foco na inclusão escolar dos estudantes com esse transtorno.',
        'UECE',
        'DESENHO_INDUSTRIAL',
        '2024-12-17'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Caciana Ribeiro Oliveira', 'Gislei Frota Aragao']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O diferencial do jogo está na abordagem prática e colaborativa, baseada em experiências reais de professores. As perguntas surgiram de conversas e trocas de vivências, proporcionando aprendizado dinâmico e aplicado, voltado para a solução de dúvidas e melhoria da inclusão de alunos com TEA no ambiente escolar.',
        'BR 30 2024 006940 5',
        'BR 30 2024 006940 5',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 30 2024 006940 5'
          AND p.nome = 'Conhecimento e inclusão: desvendando o Transtorno do Espectro Autista'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'DESENHO_INDUSTRIAL' FROM nova_protecao;

-- [118/242] DESENHO INDUSTRIAL (Linha 5) - BR 30 2024 005366 5 - Jogo manutenção do PICC
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Jogo manutenção do PICC',
        'Trata-se de um jogo de perguntas e respostas, simulações de condutas e demonstrações de práticas, desenvolvido para aprimorar o conhecimento dos enfermeiros sobre a manutenção do cateter PICC em pediatria. A tecnologia educativa visa proporcionar um aprendizado dinâmico e engajador.',
        'UECE',
        'DESENHO_INDUSTRIAL',
        '2024-10-01'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Ana Valeska Siebra e Silva', 'Janayna Pinheiro Bezerra']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O diferencial do desenho industrial está no seu formato interativo e prático, que combina teoria e simulações reais, permitindo aos enfermeiros aprender e reforçar as boas práticas na manutenção do cateter PICC de maneira ativa e envolvente.',
        'BR 30 2024 005366 5',
        'BR 30 2024 005366 5',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 30 2024 005366 5'
          AND p.nome = 'Jogo manutenção do PICC'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'DESENHO_INDUSTRIAL' FROM nova_protecao;

-- [119/242] DESENHO INDUSTRIAL (Linha 6) - BR 30 2024 004131 4 - Mosquito em foco
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Mosquito em foco',
        'Trata-se de um jogo de tabuleiro educativo que aborda as doenças transmitidas pelo mosquito Aedes aegypti, como dengue, zika e chikungunya. O jogo tem como objetivo ensinar sobre prevenção, tratamento, sintomas e consequências dessas doenças, promovendo a conscientização de maneira lúdica.',
        'UECE',
        'DESENHO_INDUSTRIAL',
        '2024-08-14'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Edna Maria Camelo Chaves', 'Aline Dantas Sousa']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O diferencial do jogo" está na sua abordagem lúdica e interativa, que torna o aprendizado sobre arboviroses não apenas informativo, mas também divertido e cativante. Ao combinar um jogo de tabuleiro com conteúdo educativo, ele facilita a compreensão de temas complexos, como prevenção e consequências das doenças transmitidas pelo Aedes aegypti',
        'BR 30 2024 004131 4',
        'BR 30 2024 004131 4',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 30 2024 004131 4'
          AND p.nome = 'Mosquito em foco'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'DESENHO_INDUSTRIAL' FROM nova_protecao;

-- [120/242] DESENHO INDUSTRIAL (Linha 7) - BR 30 2024 001773 1 - Ludo Ativo
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Ludo Ativo',
        'É um jogo educativo em saúde composto por um tabuleiro eneagonal, com nove espaços representando diferentes áreas da cidade, e 55 cartas. Desenvolvido em colaboração com 32 crianças de 8 a 10 anos de uma escola municipal.',
        'UECE',
        'DESENHO_INDUSTRIAL',
        '2024-04-11'::date,
        'Data de Concessão: 2024-10-22',
        NULL, NULL, NULL,
        'Concedido',
        ARRAY['Ilvana Lima Verde Gomes', 'Debora Cristina Couto Oliveira Costa']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O diferencial do "Ludo Ativo" está na sua capacidade de promover a atividade física de forma divertida e acessível, com um design que facilita sua reprodução e adaptação em diferentes contextos, como escolas, residências e unidades de saúde.',
        'BR 30 2024 001773 1',
        'BR 30 2024 001773 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 30 2024 001773 1'
          AND p.nome = 'Ludo Ativo'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'DESENHO_INDUSTRIAL' FROM nova_protecao;

-- =============================================================================
-- 4. ABA: PATENTE DE INVENÇÃO (122 registros)
-- =============================================================================

-- [121/242] PATENTE DE INVENÇÃO (Linha 2) - BR 10 2025 028474 0 - FORMULAÇÃO EM GEL À BASE DE ROMÃ PARA O TRATAMENTO DA DOR OROFACIAL
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'FORMULAÇÃO EM GEL À BASE DE ROMÃ PARA O TRATAMENTO DA DOR OROFACIAL',
        'A invenção descreve uma formulação farmacêutica em gel contendo extrato aquoso do fruto de Punica granatum (romã), desenvolvida para o tratamento da dor orofacial. O gel é formulado com extrato aquoso do fruto, incorporado a uma base de carboximetilcelulose, sorbitol e um conservante, criando um sistema estável e homogêneo. Essa fórmula visa oferecer efeito antinociceptivo, atuando especificamente na modulação dos canais TRPV1, responsáveis pela percepção da dor, sem causar efeitos tóxicos ou alterações comportamentais.',
        'UECE',
        'PATENTE',
        '2025-12-19'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['SACHA AUBREY ALVES RODRIGUES SANTOS', 'REGINA CLÁUDIA DE MATOS DOURADO', 'THATIANE CHRISTINA FROTA CATUNDA RODRIGUES DE CASTRO', 'ADRIANA ROLIM CAMPOS', 'FRANCISCO ERNANI ALVES MAGALHÃES']::varchar[],
        'Fundação Edson Queiroz / Fundação Universidade Estadual do Ceará',
        'O diferencial tecnológico dessa formulação está na combinação única de ingredientes, especialmente o extrato aquoso de romã, com uma base de carboximetilcelulose, sorbitol e conservante, que resulta em um gel estável e homogêneo. O principal diferencial é sua ação específica nos canais TRPV1, responsáveis pela sensação de dor, proporcionando alívio eficaz da dor orofacial sem causar efeitos tóxicos ou alterações comportamentais. Isso torna a formulação mais segura e eficaz em comparação com outras terapias que podem ter efeitos colaterais indesejados.',
        'BR 10 2025 028474 0',
        'BR 10 2025 028474 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2025 028474 0'
          AND p.nome = 'FORMULAÇÃO EM GEL À BASE DE ROMÃ PARA O TRATAMENTO DA DOR OROFACIAL'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [122/242] PATENTE DE INVENÇÃO (Linha 3) - BR 10 2025 024037 8 - Chalcona furano-hidroxifenil com ação ansiolítica e anticonvulsivante
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Chalcona furano-hidroxifenil com ação ansiolítica e anticonvulsivante',
        'A invenção refere-se à chalcona (E)-3-(furan-2-il)-1-(2-hidroxifenil)prop-2-en-1-ona (CHALFHP), avaliada quanto aos efeitos ansiolítico e anticonvulsivante em zebrafish adulto. Testes comportamentais e de toxicidade (96 h) mostraram que a CHALFHP é não tóxica, altera levemente a locomoção e apresenta efeito ansiolítico nos testes claro/escuro e campo aberto. O efeito ansiolítico e anticonvulsivante foi mediado via receptor GABA_A, confirmado pelo bloqueio com flumazenil e por estudos de docking molecular.',
        'UECE',
        'PATENTE',
        '2025-11-04'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['MILENA LIRA FURTADO', 'HÉLCIO SILVA DOS SANTOS', 'JANE EIRE SILVA ALENCAR DE MENEZES', 'JESYKA MACÊDO GUEDES', 'SÔNIA MARIA COSTA SIQUEIRA', 'MARIA KUEIRISLENE AMÂNCIO FERREIRA']::varchar[],
        'FUNDAÇÃO UNIVERSIDADE ESTADUAL DO CEARÁ / FUNDAÇÃO UNIVERSIDADE ESTADUAL VALE DO ACARAÚ.',
        'A substância apresenta ação dupla, ansiolítica e anticonvulsivante, atuando por meio da modulação dos receptores GABA_A. Os estudos demonstraram segurança comprovada, sendo atóxica nas doses testadas por um período de até 96 horas, sem induzir sedação significativa. A validação mecanística do efeito ocorreu por meio de ensaios farmacológicos com flumazenil e análises de docking molecular, confirmando a mediação pelo sistema GABAérgico. Esses resultados indicam o potencial da substância como substituta aos benzodiazepínicos, com menor risco de efeitos adversos relacionados à memória e à psicomotricidade. A eficácia e a segurança foram demonstradas em um estudo in vivo robusto, utilizando o zebrafish como modelo comportamental e farmacológico.',
        'BR 10 2025 024037 8',
        'BR 10 2025 024037 8',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2025 024037 8'
          AND p.nome = 'Chalcona furano-hidroxifenil com ação ansiolítica e anticonvulsivante'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [123/242] PATENTE DE INVENÇÃO (Linha 4) - BR 10 2025 023502 1 - Compostos de chalcona substituídos com etóxi e flúor para uso terapêut
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Compostos de chalcona substituídos com etóxi e flúor para uso terapêutico no sistema nervoso central em modelo zebrafish',
        'A tecnologia refere-se ao uso de chalconas sintéticas substituídas com etóxi e flúor para aplicação terapêutica no sistema nervoso central. Os compostos P-Etóxi e P-Flúor foram avaliados em modelo experimental de zebrafish adulto, apresentando efeitos ansiolítico, anticonvulsivante e de preservação da memória, associados à modulação do sistema GABAérgico, sem evidência de toxicidade aguda.',
        'UECE',
        'PATENTE',
        '2025-10-29'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['ITALO MOURA BARBOSA', 'HÉLCIO SILVA DOS SANTOS', 'JANE EIRE SILVA ALENCAR DE MENEZES', 'EMMANUEL SILVA MARINHO', 'MÁRCIA MACHADO MARINHO', 'JESYKA MACÊDO GUEDES', 'MARIA KUEIRISLENE AMÂNCIO FERREIRA']::varchar[],
        'FUNDAÇÃO UNIVERSIDADE ESTADUAL DO CEARÁ / FUNDAÇÃO UNIVERSIDADE ESTADUAL VALE DO ACARAÚ',
        'Os compostos desenvolvidos demonstram atividade terapêutica relevante em transtornos de ansiedade, epilepsia e disfunções cognitivas, com menor incidência de efeitos adversos como sedação, dependência e prejuízo cognitivo. A atuação parcial sobre o receptor GABAA indica um mecanismo de ação mais seletivo, configurando uma alternativa promissora aos fármacos atualmente disponíveis.',
        'BR 10 2025 023502 1',
        'BR 10 2025 023502 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2025 023502 1'
          AND p.nome = 'Compostos de chalcona substituídos com etóxi e flúor para uso terapêutico no sistema nervoso central em modelo zebrafish'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [124/242] PATENTE DE INVENÇÃO (Linha 5) - BR 10 2025 022817 3 - SISTEMA DE PRÉ-TRATAMENTO DE RESÍDUOS ORGÂNICOS FERMENTESCÍVEIS SEGUID
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'SISTEMA DE PRÉ-TRATAMENTO DE RESÍDUOS ORGÂNICOS FERMENTESCÍVEIS SEGUIDO DE REATORES ANAERÓBIOS PARA PRODUÇÃO DE HIDROGÊNIO E/OU METANO',
        'A tecnologia consiste em um sistema integrado para o pré-tratamento e a digestão anaeróbia de resíduos orgânicos fermentescíveis, visando à produção de hidrogênio e/ou metano. O sistema combina etapas de trituração, separação das frações sólida e líquida e reatores específicos para fermentação escura e metanogênese, além de módulos para tratamento do biogás, do hidrogênio, dos efluentes e do digestato.',
        'UECE',
        'PATENTE',
        '2025-10-21'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['RENATO CARRHÁ LEITÃO', 'ADRIANO LINCOLN ALBUQUERQUE MATTOS', 'RAIMUNDO MARCELINO DA SILVA NETO', 'CAMILA APARECIDA DE MENEZES', 'PRISCILLA DE SOUZA ALMEIDA', 'ANDRÉ BEZERRA DOS SANTOS', 'WILLIAM MAGALHÃES BARCELLOS', 'DANIEL RODRIGUES DOS SANTOS', 'THOBIAS PEREIRA SILVA', 'WILLAME DE ARAÚJO CAVALCANTE', 'HEBERT DOS SANTOS LIMA', 'FRANCISCO DAS CHAGAS GOMES DA SILVA JÚNIOR']::varchar[],
        'FUNDAÇÃO UNIVERSIDADE ESTADUAL DO CEARÁ / INSTITUTO FEDERAL DE EDUCAÇÃO, CIÊNCIA E TECNOLOGIA DO CEARÁ - IFCE / UNIVERSIDADE FEDERAL DO CEARÁ - UFC / EMPRESA BRASILEIRA DE PESQUISA AGROPECUÁRIA - EMBRAPA / CENTRAIS DE ABASTECIMENTO DO CEARÁ - CEASA/CE',
        'A integração de múltiplos reatores especializados para frações distintas dos resíduos permite maior aproveitamento energético e eficiência do processo. A conversão simultânea de resíduos em bioenergia, fertilizante agrícola e água de reuso contribui para a redução de impactos ambientais e para a aplicação de princípios da economia circular.',
        'BR 10 2025 022817 3',
        'BR 10 2025 022817 3',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2025 022817 3'
          AND p.nome = 'SISTEMA DE PRÉ-TRATAMENTO DE RESÍDUOS ORGÂNICOS FERMENTESCÍVEIS SEGUIDO DE REATORES ANAERÓBIOS PARA PRODUÇÃO DE HIDROGÊNIO E/OU METANO'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [125/242] PATENTE DE INVENÇÃO (Linha 6) - BR 10 2025 021170 0 - Uso de extrato do fungo Beauveria bassiana como potencial agente ansio
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Uso de extrato do fungo Beauveria bassiana como potencial agente ansiolítico',
        'A tecnologia refere-se à avaliação do potencial ansiolítico do extrato em acetato de etila do fungo Beauveria bassiana, bem como à caracterização das classes químicas presentes no extrato. Técnicas de UHPLC-HRMS/MS combinadas com processamento de dados baseado em machine learning foram utilizadas para a identificação das principais classes de metabólitos, com destaque para oligopeptídeos, especialmente depsipeptídeos.',
        'UECE',
        'PATENTE',
        '2025-10-01'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['DÁVILA DE SOUZA ZAMPIERI', 'FRANCISCO ERIVALDO FREITAS DA SILVA', 'ELENILSON DE GODOY ALVES FILHO', 'DANIELE DE OLIVEIRA BEZERRA DE SOUSA', 'TELMA LEDA GOMES DE LEMOS', 'ELIANE MAYUMI INOKUTI', 'MARIA DAIANE DE FREITAS', 'JANE EIRE SILVA ALENCAR DE MENEZES', 'HÉLCIO SILVA DOS SANTOS', 'JÉSSICA BEZERRA MACIEL', 'RODOLFO DANTAS LIMA JUNIOR', 'HECTOR HENRIQUE FERREIRA KOOLEN']::varchar[],
        'UNIVERSIDADE FEDERAL DO CEARÁ / FUNDAÇÃO UNIVERSIDADE ESTADUAL DO CEARA / FUNDAÇÃO UNIVERSIDADE ESTADUAL VALE DO ACARAÚ / UNIVERSIDADE DO ESTADO DO AMAZONAS - UEA / UNIVERSIDADE ESTADUAL DE CAMPINAS - UNICAMP.',
        'O extrato avaliado apresentou atividade ansiolítica em modelo adulto de peixe-zebra, com efeito comparável ao diazepam e ausência de toxicidade ou prejuízo locomotor. A associação entre a composição química rica em oligopeptídeos e a neuromodulação pela via serotoninérgica indica potencial terapêutico para o tratamento da ansiedade, ampliando as possibilidades de uso de metabólitos fúngicos em aplicações farmacológicas.',
        'BR 10 2025 021170 0',
        'BR 10 2025 021170 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2025 021170 0'
          AND p.nome = 'Uso de extrato do fungo Beauveria bassiana como potencial agente ansiolítico'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [126/242] PATENTE DE INVENÇÃO (Linha 7) - BR 10 2025 019441 4 - BIOMEMBRANA CICATRIZANTE
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'BIOMEMBRANA CICATRIZANTE',
        'A tecnologia consiste em uma biomembrana cicatrizante destinada à reparação de feridas cutâneas e dermopatias, composta por uma matriz de iota-carragenana e kappa-carragenana incorporada a aminoácidos e agentes bioativos, como prolina, hidroxiprolina, alfa-bisabolol e composto de zinco. A biomembrana é produzida preferencialmente por bioimpressão tridimensional, resultando em uma estrutura multicamadas com propriedades mecânicas e reológicas adequadas ao crescimento celular.',
        'UECE',
        'PATENTE',
        '2025-09-12'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['RENATO CÂNDIDO ZIMMERMANN', 'VÂNIA MARILANDE CECCATTO', 'LUANY ELVIRA MESQUITA CARVALHO', 'MÁRJORY LIMA HOLANDA ARAÚJO', 'LUCIANA MARIA DE BARROS CARLOS', 'JONATHAN ELIAS RODRIGUES MARTINS', 'JANNISON KARLLY CAVALCANTE RIBEIRO', 'FELIPE PANTOJA MESQUITA', 'PEDRO EVERSON ALEXANDRE DE AQUINO', 'FRANCISCA VÂNIA BARRETO AGUIAR FERREIRA GOMES']::varchar[],
        'FUNDAÇÃO UNIVERSIDADE ESTADUAL DO CEARÁ, INSTITUTO PRO HEMOCE E UNIVERSIDADE FEDERAL DO CEARÁ',
        'A combinação de carragenanas com agentes bioativos e a fabricação por bioimpressão 3D permitem a obtenção de um material biocompatível com arquitetura controlada. Essa configuração favorece a síntese de colágeno, a proliferação celular e a modulação do processo inflamatório, contribuindo para a redução do tempo de cicatrização e melhoria da qualidade do tecido regenerado.',
        'BR 10 2025 019441 4',
        'BR 10 2025 019441 4',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2025 019441 4'
          AND p.nome = 'BIOMEMBRANA CICATRIZANTE'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [127/242] PATENTE DE INVENÇÃO (Linha 8) - BR 10 2025 016626 7 - Processo de síntese da chalcona C2OHPDA e seu uso na prevenção de défi
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de síntese da chalcona C2OHPDA e seu uso na prevenção de déficit de memória induzido por etanol em modelo zebrafish',
        'Processo de síntese e caracterização da chalcona semissintética (E)-3-(4-(dimetilamino)fenil)-1-(2-hidroxifenil)prop-2-en-1-ona (C2OHPDA), obtida por reação de Claisen-Schmidt, com estrutura confirmada por técnicas espectroscópicas. O composto é aplicado como agente neuroprotetor em modelo experimental de zebrafish, demonstrando capacidade de prevenir déficits de memória induzidos por exposição aguda ao etanol.',
        'UECE',
        'PATENTE',
        '2025-08-06'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['HÉLCIO SILVA DOS SANTOS', 'LARISSA SANTOS OLIVEIRA', 'FRANCISCO ROGENIO SILVA MENDES', 'JANE EIRE SILVA ALENCAR DE MENEZES', 'JESYKA MACÊDO GUEDES', 'MARIA KUEIRISLENE AMANCIO FERREIRA', 'ANTONIO WLISSES DA SILVA']::varchar[],
        'FUNDAÇÃO UNIVERSIDADE ESTADUAL DO CEARÁ / FUNDAÇÃO UNIVERSIDADE ESTADUAL VALE DO ACARAÚ',
        'A aplicação da chalcona C2OHPDA mostrou preservação significativa da memória em modelo zebrafish, sem induzir efeitos sedativos ou alterações locomotoras. O perfil de segurança e a atividade neuromoduladora indicam potencial uso preventivo em distúrbios cognitivos associados a agentes neurotóxicos.',
        'BR 10 2025 016626 7',
        'BR 10 2025 016626 7',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2025 016626 7'
          AND p.nome = 'Processo de síntese da chalcona C2OHPDA e seu uso na prevenção de déficit de memória induzido por etanol em modelo zebrafish'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [128/242] PATENTE DE INVENÇÃO (Linha 9) - BR 10 2025 016629 1 - CURCUMINOIDES PARA TRATAMENTO DE TRANSTORNOS NEUROLÓGICOS E COGNITIVOS
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'CURCUMINOIDES PARA TRATAMENTO DE TRANSTORNOS NEUROLÓGICOS E COGNITIVOS EM MODELO ZEBRAFISH',
        'Síntese e aplicação farmacológica de compostos derivados da dibenzalacetona, estruturalmente relacionados aos curcuminoides, com maior estabilidade química e melhor perfil farmacocinético. Os derivados foram avaliados in vitro e em modelo zebrafish adulto, apresentando atividade ansiolítica, anticonvulsivante e neuroprotetora, com preservação da memória em contextos de estresse oxidativo e intoxicação por etanol.',
        'UECE',
        'PATENTE',
        '2025-08-06'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['MARIA KUEIRISLENE AMÂNCIO FERREIRA', 'ANTONIO WLISSES DA SILVA', 'HELCIO SILVA DOS SANTOS', 'JOILNA ALVES DA SILVA', 'MÁRCIA MACHADO MARINHO', 'FRANCISCO ROGÊNIO DA SILVA MENDES', 'JANE EIRE SILVA ALENCAR DE MENEZES', 'EMMANUEL SILVA MARINHO']::varchar[],
        'FUNDAÇÃO UNIVERSIDADE ESTADUAL DO CEARÁ / FUNDAÇÃO UNIVERSIDADE ESTADUAL VALE DO ACARAÚ',
        'Os derivados desenvolvidos demonstraram eficácia comportamental associada à modulação do receptor GABAA, com menor toxicidade e ausência de efeitos adversos significativos. O desempenho superior em relação à curcumina e a possibilidade de uso como alternativa aos benzodiazepínicos indicam maior segurança e potencial terapêutico para o tratamento de transtornos neurológicos e cognitivos.',
        'BR 10 2025 016629 1',
        'BR 10 2025 016629 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2025 016629 1'
          AND p.nome = 'CURCUMINOIDES PARA TRATAMENTO DE TRANSTORNOS NEUROLÓGICOS E COGNITIVOS EM MODELO ZEBRAFISH'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [129/242] PATENTE DE INVENÇÃO (Linha 10) - BR 10 2025 014738 6 - ALCALOIDE MARINHO PETROSAMINA PARA TRATAMENTO DA ANSIEDADE E PRESERVAÇ
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'ALCALOIDE MARINHO PETROSAMINA PARA TRATAMENTO DA ANSIEDADE E PRESERVAÇÃO DA MEMÓRIA EM ZEBRAFISH (Danio rerio) ADULTO',
        'Caracterização da atividade ansiolítica, neuroprotetora e do mecanismo de ação do alcaloide marinho petrosamina, extraído de esponjas do gênero Petrosia sp. O composto foi avaliado em modelo experimental de zebrafish, apresentando perfil de segurança adequado, efeitos ansiolíticos comparáveis ao diazepam e preservação da memória mesmo sob estímulos aversivos e exposição ao álcool.',
        'UECE',
        'PATENTE',
        '2025-07-16'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['JOILNA ALVES DA SILVA', 'HELCIO SILVA DOS SANTOS', 'ANTÔNIO WLISSES DA SILVA', 'EMMANUEL SILVA MARINHO', 'MARIA KUEIRISLENE AMÂNCIO FERREIRA', 'MÁRCIA MACHADO MARINHO', 'FRANCISCO DAS CHAGAS LIMA PINTO', 'JANE EIRE SILVA ALENCAR DE MENEZES', 'OTÍLIA DEUSDENIA LOIOLA PESSOA']::varchar[],
        'FUNDAÇÃO UNIVERSIDADE ESTADUAL DO CEARÁ / UNIVERSIDADE FEDERAL DO CEARÁ - UFC / FUNDAÇÃO UNIVERSIDADE ESTADUAL VALE DO ACARAÚ',
        'A petrosamina demonstrou eficácia ansiolítica associada à modulação do receptor GABAA e preservação da memória em baixas doses, com ausência de toxicidade aguda. O desempenho superior na manutenção da função cognitiva, aliado à origem marinha do composto, indica potencial para o desenvolvimento de bioprodutos neuroprotetores inovadores com aplicação farmacêutica.',
        'BR 10 2025 014738 6',
        'BR 10 2025 014738 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2025 014738 6'
          AND p.nome = 'ALCALOIDE MARINHO PETROSAMINA PARA TRATAMENTO DA ANSIEDADE E PRESERVAÇÃO DA MEMÓRIA EM ZEBRAFISH (Danio rerio) ADULTO'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [130/242] PATENTE DE INVENÇÃO (Linha 11) - BR 10 2025 014009 8 - Dispositivo de avaliação da marcha de murinos
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Dispositivo de avaliação da marcha de murinos',
        'Dispositivo para avaliação funcional da marcha de murinos em ambiente laboratorial, composto por uma plataforma transparente e um compartimento escuro que direciona a locomoção dos animais. O sistema utiliza uma câmera posicionada abaixo da plataforma para capturar imagens da região ventral durante a caminhada, permitindo a extração de parâmetros de marcha por meio de software, com uso de hardware básico.',
        'UECE',
        'PATENTE',
        '2025-07-07'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['PEDRO CUNHA LOPES', 'VÂNIA MARILANDE CECCATTO', 'JEFFERSON PACHECO AMARAL FORTES', 'ANTONIO NADSON MODESTO FILHO', 'FRANCISCO FLEURY UCHOA SANTOS JÚNIOR', 'KARLA CAMILA LIMA DE SOUZA']::varchar[],
        'FUNDAÇÃO UNIVERSIDADE ESTADUAL DO CEARÁ',
        'O sistema possibilita a análise detalhada da locomoção sem a necessidade de equipamentos complexos, como plataformas de pressão ou sistemas múltiplos de medição. A configuração simplificada e personalizável permite a obtenção eficiente de dados cinemáticos, ampliando a acessibilidade para estudos de biomecânica, avaliação motora e intervenções terapêuticas.',
        'BR 10 2025 014009 8',
        'BR 10 2025 014009 8',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2025 014009 8'
          AND p.nome = 'Dispositivo de avaliação da marcha de murinos'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [131/242] PATENTE DE INVENÇÃO (Linha 12) - BR 10 2025 014011 0 - SISTEMA REACIONAL PARA A PRODUÇÃO DE BIOCARVÃO (BIOCHAR) POR PROCESSO 
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'SISTEMA REACIONAL PARA A PRODUÇÃO DE BIOCARVÃO (BIOCHAR) POR PROCESSO DE PIRÓLISE',
        'Sistema para produção de biocarvão por pirólise de resíduos de biomassa de origem vegetal, animal ou mista, com reaproveitamento dos gases não condensáveis. O conjunto é composto por câmara de combustão, reator de pirólise, queimador a gás, rosca helicoidal, sistemas de segurança e alimentação automatizada, resultando na geração de biocarvão, bio-óleo e gases não condensáveis.',
        'UECE',
        'PATENTE',
        '2025-07-07'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['MONA LISA MOURA DE OLIVEIRA', 'GILBERTO ALVES BEZERRA', 'DANIEL SILVEIRA SERRA', 'VINICIUS DE CARVALHO ARAÚJO', 'GUSTAVO ELTON DE OLIVEIRA COSTA TEIXEIRA', 'LUCINDA OLIVEIRA AMARO', 'CAILINY DARLEY DE MENEZES MEDEIROS', 'ROGÉRIA DE MELO OLIVEIRA', 'PAULO FRANCISCO KUNZ JORDÃO', 'THIAGO MARTINS DANTAS', 'CLAUDIANE QUARESMA PINTO BEZERRA']::varchar[],
        'FUNDAÇÃO UNIVERSIDADE ESTADUAL DO CEARÁ / COMPANHIA DE ÁGUA E ESGOTO DO CEARÁ - CAGECE',
        'O reaproveitamento dos gases não condensáveis contribui para a autossustentabilidade energética do processo. A produção simultânea de múltiplos coprodutos amplia as possibilidades de uso dos resíduos de biomassa para geração de energia, bioinsumos e biocombustíveis de baixo carbono.',
        'BR 10 2025 014011 0',
        'BR 10 2025 014011 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2025 014011 0'
          AND p.nome = 'SISTEMA REACIONAL PARA A PRODUÇÃO DE BIOCARVÃO (BIOCHAR) POR PROCESSO DE PIRÓLISE'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [132/242] PATENTE DE INVENÇÃO (Linha 13) - BR 10 2025 012962 0 - Chalcona semissintética derivada de Croton anisodontus para tratamento
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Chalcona semissintética derivada de Croton anisodontus para tratamento de transtornos de ansiedade em zebrafish',
        'Avaliação do efeito ansiolítico de uma chalcona semissintética derivada de 2-hidroxi-3,4,6-trimetoxiacetofenona, isolada de Croton anisodontus, em modelo adulto de zebrafish. O composto apresentou ausência de toxicidade aguda e efeito ansiolítico significativo, com atuação predominante sobre a neurotransmissão serotoninérgica, confirmada por testes comportamentais e simulações de docking molecular.',
        'UECE',
        'PATENTE',
        '2025-06-23'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['JESYKA MACÊDO GUEDES', 'ANTONIO WLISSES DA SILVA', 'EMMANUEL SILVA MARINHO', 'HÉLCIO SILVA DOS SANTOS', 'JANE EIRE SILVA ALENCAR DE MENEZES', 'MÁRCIA MACHADO MARINHO', 'MARIA KUEIRISLENE AMÂNCIO FERREIRA']::varchar[],
        'FUNDAÇÃO UNIVERSIDADE ESTADUAL DO CEARÁ / FUNDAÇÃO UNIVERSIDADE ESTADUAL VALE DO ACARAÚ',
        'A identificação do receptor 5-HT3AR como principal alvo molecular, associada à alta permeabilidade celular e capacidade de atravessar a barreira hematoencefálica, indica um mecanismo de ação específico e favorável para aplicação no sistema nervoso central. Esses aspectos sustentam o potencial do composto para o desenvolvimento de novas alternativas terapêuticas para transtornos de ansiedade.',
        'BR 10 2025 012962 0',
        'BR 10 2025 012962 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2025 012962 0'
          AND p.nome = 'Chalcona semissintética derivada de Croton anisodontus para tratamento de transtornos de ansiedade em zebrafish'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [133/242] PATENTE DE INVENÇÃO (Linha 14) - BR 10 2025 012940 0 - USO DA ROBININA ISOLADA DA Solanum asperum PARA TRATAMENTO DE ANSIEDAD
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'USO DA ROBININA ISOLADA DA Solanum asperum PARA TRATAMENTO DE ANSIEDADE, EPILEPSIA E PREVENÇÃO DE MEMÓRIA RELACIONADA A ESTÍMULOS AVERSIVOS',
        'Avaliação farmacológica do flavonoide robinina, isolado de Solanum asperum, para o tratamento da ansiedade, epilepsia e prevenção de déficits de memória associados a estímulos aversivos. O composto foi testado em modelo zebrafish, apresentando ausência de toxicidade, efeitos ansiolítico e anticonvulsivante e preservação da memória, com envolvimento dos receptores GABAA.',
        'UECE',
        'PATENTE',
        '2025-06-23'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['CECÍLIA GUIMARÃES LEMOS', 'FRANCISCO DAS CHAGAS LIMA PINTO', 'EMMANUEL SILVA MARINHO', 'HELCIO SILVA DOS SANTOS', 'JANE EIRE SILVA ALENCAR DE MENEZES', 'JÉSSICA BEZERRA MACIEL', 'MARIA KUEIRISLENE AMÂNCIO FERREIRA', 'MÁRCIA MACHADO MARINHO', 'MATHEUS NUNES DA ROCHA', 'OTILIA DEUSDENIA LOIOLA PESSOA']::varchar[],
        'FUNDAÇÃO UNIVERSIDADE ESTADUAL DO CEARÁ / UNIVERSIDADE FEDERAL DO CEARÁ / FUNDAÇÃO UNIVERSIDADE ESTADUAL VALE DO ACARAÚ',
        'A robinina demonstrou atividade terapêutica semelhante ao diazepam, sem induzir sedação ou prejuízo cognitivo. A capacidade de prevenir crises convulsivas e preservar a memória, aliada ao perfil farmacocinético moderado, indica potencial uso como alternativa aos benzodiazepínicos no desenvolvimento de novos fármacos.',
        'BR 10 2025 012940 0',
        'BR 10 2025 012940 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2025 012940 0'
          AND p.nome = 'USO DA ROBININA ISOLADA DA Solanum asperum PARA TRATAMENTO DE ANSIEDADE, EPILEPSIA E PREVENÇÃO DE MEMÓRIA RELACIONADA A ESTÍMULOS AVERSIVOS'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [134/242] PATENTE DE INVENÇÃO (Linha 15) - BR 10 2025 012948 5 - USO DE UMA HIDRAZIDA COM ATIVIDADE ANTIBACTERIANA E ANTIBIOFILME
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'USO DE UMA HIDRAZIDA COM ATIVIDADE ANTIBACTERIANA E ANTIBIOFILME',
        'Avaliação do uso de uma hidrazida derivada do ibuprofeno (HIDZ) com atividade antibacteriana e antibiofilme. O composto foi investigado como estratégia não antibiótica para o tratamento de infecções bacterianas, demonstrando eficácia contra bactérias Gram-positivas e Gram-negativas.',
        'UECE',
        'PATENTE',
        '2025-06-23'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['BENISE FERREIRA DA SILVA', 'HELCIO SILVA DOS SANTOS', 'ANTONIO MATEUS GOMES PEREIRA', 'VICTOR ALVES CARNEIRO', 'RENATA ALBUQUERQUE COSTA', 'FRANCISCO KAUÊ CARVALHO AGUIAR', 'INGRID MARIA FROTA ARAÚJO']::varchar[],
        'FUNDAÇÃO UNIVERSIDADE ESTADUAL DO CEARÁ / CENTRO UNIVERSITÁRIO INTA - UNINTA / FUNDAÇÃO UNIVERSIDADE ESTADUAL VALE DO ACARAÚ',
        'A hidrazida apresenta atividade antibacteriana associada à capacidade de inibir a formação de biofilmes, contribuindo para o enfrentamento da resistência bacteriana. O uso de um derivado de fármaco conhecido amplia as possibilidades de reaproveitamento terapêutico com potencial redução de custos e efeitos adversos.',
        'BR 10 2025 012948 5',
        'BR 10 2025 012948 5',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2025 012948 5'
          AND p.nome = 'USO DE UMA HIDRAZIDA COM ATIVIDADE ANTIBACTERIANA E ANTIBIOFILME'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [135/242] PATENTE DE INVENÇÃO (Linha 16) - BR 10 2025 006167 8 - PRODUÇÃO DE NOVOS DERIVADOS DA HIDRALAZINA COMO AGENTES TERAPÊUTICOS P
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'PRODUÇÃO DE NOVOS DERIVADOS DA HIDRALAZINA COMO AGENTES TERAPÊUTICOS PARA ANSIEDADE',
        'Processo de síntese de novos derivados hidrazônicos da hidralazina, desenvolvidos para potencializar a ação no sistema nervoso central, com foco na redução dos sintomas de ansiedade. Os compostos foram submetidos a testes de toxicidade, segurança e investigação dos mecanismos de ação, demonstrando aplicabilidade em tratamentos neurológicos.',
        'UECE',
        'PATENTE',
        '2025-03-28'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['IVANA CARNEIRO ROMÃO', 'AMANDA MARIA BARROS ALVES', 'EMMANUEL SILVA MARINHO', 'HELCIO SILVA DOS SANTOS', 'JANE EIRE SILVA ALENCAR DE MENEZES', 'MÁRCIA MACHADO MARINHO', 'MATHEUS NUNES DA ROCHA', 'SONIA MARIA COSTA SIQUEIRA']::varchar[],
        'FUNDAÇÃO UNIVERSIDADE ESTADUAL DO CEARÁ / FUNDAÇÃO UNIVERSIDADE ESTADUAL VALE DO ACARAÚ',
        'Os derivados hidrazônicos apresentaram maior eficácia ansiolítica e menor risco de efeitos colaterais em comparação aos tratamentos convencionais. A modificação química de um fármaco já conhecido amplia suas aplicações terapêuticas, contribuindo para o desenvolvimento de medicamentos mais seguros e eficientes para transtornos de ansiedade.',
        'BR 10 2025 006167 8',
        'BR 10 2025 006167 8',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2025 006167 8'
          AND p.nome = 'PRODUÇÃO DE NOVOS DERIVADOS DA HIDRALAZINA COMO AGENTES TERAPÊUTICOS PARA ANSIEDADE'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [136/242] PATENTE DE INVENÇÃO (Linha 17) - BR 10 2025 006052 3 - (E)-6-(4-((E)-3-(3- NITROFENIL)ACRILOIL)FENIL)-5-OXOHEX-2- ENÓICO: UM 
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        '(E)-6-(4-((E)-3-(3- NITROFENIL)ACRILOIL)FENIL)-5-OXOHEX-2- ENÓICO: UM DERIVADO DE CHALCONA COM POTENCIAL TERAPÊUTICO ANSIOLÍTICO E ANTICONVULSIVANTE',
        'Síntese e aplicação farmacológica da chalcona (E)-6-(4-((E)-3-(3-nitrofenil)acriloil)fenil)-5-oxohex-2-enóico (CAMEL), avaliada quanto às atividades ansiolítica e anticonvulsivante. O composto foi testado in vivo em modelo zebrafish, apresentando ausência de toxicidade e efeitos comportamentais compatíveis com fármacos de referência, além de estudos in silico e DMPK que indicaram boa permeabilidade e acesso ao sistema nervoso central.',
        'UECE',
        'PATENTE',
        '2025-03-27'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['FRANCISCO NITHAEL MELO LUCIO', 'AKENATON ONASSIS CARDOSO VIANA GOMES', 'ALEXANDRE MAGNO RODRIGUES TEIXEIRA', 'CAIO HENRIQUE ALEXANDRE ROBERTO', 'EMANUELLE MACHADO MARINHO', 'EMMANUEL SILVA MARINHO', 'HELCIO SILVA DOS SANTOS', 'IVANA CARNEIRO ROMÃO', 'JANE EIRE SILVA ALENCAR DE MENEZES', 'MARIA KUEIRISLENE AMÂNCIO FERREIRA', 'MÁRCIA MACHADO MARINHO', 'PAULO NOGUEIRA BANDEIRA']::varchar[],
        'FUNDAÇÃO UNIVERSIDADE ESTADUAL DO CEARÁ / FUNDAÇÃO UNIVERSIDADE ESTADUAL VALE DO ACARAÚ',
        'O composto demonstrou interação específica com o sítio agonista do diazepam nos receptores GABAA, associada a boa permeabilidade intestinal e cerebral. O perfil farmacocinético favorável e o potencial ansiolítico e anticonvulsivante indicam aplicabilidade terapêutica com base em controle adequado da dose oral.',
        'BR 10 2025 006052 3',
        'BR 10 2025 006052 3',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2025 006052 3'
          AND p.nome = '(E)-6-(4-((E)-3-(3- NITROFENIL)ACRILOIL)FENIL)-5-OXOHEX-2- ENÓICO: UM DERIVADO DE CHALCONA COM POTENCIAL TERAPÊUTICO ANSIOLÍTICO E ANTICONVULSIVANTE'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [137/242] PATENTE DE INVENÇÃO (Linha 18) - BR 10 2025 002361 0 - MÉTODO HIDROTERMAL POLIMÉRICO ASSISTIDO POR MICRO- ONDAS PARA SÍNTESE 
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'MÉTODO HIDROTERMAL POLIMÉRICO ASSISTIDO POR MICRO- ONDAS PARA SÍNTESE DE NANOPARTÍCULAS SUPERPARAMAGNÉTICAS DE FERRITAS',
        'Processo de obtenção de nanopartículas superparamagnéticas de ferritas em etapa única, utilizando polímeros naturais como agentes redutores e de recobrimento. O processo resulta em nanopartículas cristalinas, com distribuição de tamanho homogênea, morfologia controlada, elevada magnetização de saturação e boa dispersão em meio aquoso, mantendo o comportamento superparamagnético à temperatura ambiente.',
        'UECE',
        'PATENTE',
        '2025-02-06'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['IZAURA CIRINO NOGUEIRA DIOGENES', 'DIERIC DOS SANTOS DE ABREU', 'JOÃO EUDES FARIAS CAVALCANTE FILHO', 'MARIA KAROLINA DA SILVA OLIVEIRA ABREU', 'CARMINDA SANDRA BRITO SALMITO VANDERLEY']::varchar[],
        'UNIVERSIDADE FEDERAL DO CEARÁ / FUNDAÇÃO UNIVERSIDADE ESTADUAL DO CEARÁ / UNIVERSIDADE DA INTEGRAÇÃO INTERNACIONAL DA LUSOFONIA AFRO-BRASILEIRA (UNILAB).',
        'O recobrimento com polímeros naturais assegura estabilidade, potencial biocompatibilidade e preservação das propriedades magnéticas das nanopartículas. O processo é rápido, reprodutível e gera baixo volume de resíduos, favorecendo aplicações em biotecnologia e viabilizando a produção em escala industrial.',
        'BR 10 2025 002361 0',
        'BR 10 2025 002361 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2025 002361 0'
          AND p.nome = 'MÉTODO HIDROTERMAL POLIMÉRICO ASSISTIDO POR MICRO- ONDAS PARA SÍNTESE DE NANOPARTÍCULAS SUPERPARAMAGNÉTICAS DE FERRITAS'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [138/242] PATENTE DE INVENÇÃO (Linha 19) - BR 10 2025 001189 1 - DERIVADOS BIOSSINTÉTICOS DE LIMONENO PARA TRATAMENTO DE ANSIEDADE E CO
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'DERIVADOS BIOSSINTÉTICOS DE LIMONENO PARA TRATAMENTO DE ANSIEDADE E CONVULSÕES EM PEIXE- ZEBRA',
        'Composição farmacêutica à base dos enantiômeros de limoneno, (R)-(+)-limoneno e (S)-(-)-limoneno, e de seus derivados oxidados, com destaque para o ácido perílico. Os compostos foram avaliados quanto às atividades ansiolítica e anticonvulsivante, apresentando perfil de segurança adequado e eficácia em modelos experimentais, com mecanismos de ação distintos entre os enantiômeros.',
        'UECE',
        'PATENTE',
        '2025-01-22'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['JÉSSICA BEZERRA MACIEL', 'EMMANUEL SILVA MARINHO', 'JANE EIRE SILVA ALENCAR DE MENEZES', 'MARIA KUEIRISLENE AMÂNCIO FERREIRA', 'FRANCISCO ROGÊNIO DA SILVA MENDES', 'CECÍLIA GUIMARÃES LEMOS', 'RAFAELA MESQUITA BASTOS CAVALCANTE', 'HÉLCIO SILVA DOS SANTOS', 'ANTÔNIO WLISSES DA SILVA', 'THAÍS ROCHA CAVALCANTE']::varchar[],
        'FUNDAÇÃO UNIVERSIDADE ESTADUAL DO CEARÁ / FUNDAÇÃO UNIVERSIDADE ESTADUAL VALE DO ACARAÚ',
        'Combinação única de enantiômeros do limoneno com mecanismos complementares.

Processo de oxidação que aumenta a potência terapêutica.

Ácido perílico (PAC) como derivado altamente eficaz e seguro.

Ação semelhante à de benzodiazepínicos, porém com origem natural e menor toxicidade.

Potencial amplo para tratar ansiedade, epilepsia e outros distúrbios neurológicos.',
        'BR 10 2025 001189 1',
        'BR 10 2025 001189 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2025 001189 1'
          AND p.nome = 'DERIVADOS BIOSSINTÉTICOS DE LIMONENO PARA TRATAMENTO DE ANSIEDADE E CONVULSÕES EM PEIXE- ZEBRA'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [139/242] PATENTE DE INVENÇÃO (Linha 20) - BR 10 2024 025762 6 - Método de Síntese de Chalconas Sintéticas (CC-2-F, CC-4-Br, CC-4-Cl, C
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Método de Síntese de Chalconas Sintéticas (CC-2-F, CC-4-Br, CC-4-Cl, CC-4-OCH3) com Propriedades Ansiolíticas e Anticonvulsivantes',
        'Esta inovação se concentra no método de síntese de chalconas sintéticas com propriedades ansiolíticas e anticonvulsivantes. As chalconas, denominadas CC-2-F, CC-4-BR, CC-4-CL e CC-4-OCH3, foram produzidas e suas propriedades estruturais, espectroscópicas e vibracionais foram investigadas. Estudos in silico e experimentos com o modelo de Zebrafish foram realizados para avaliar suas atividades ansiolíticas e anticonvulsivantes, demonstrando efeitos positivos, como atenuação das convulsões induzidas pelo PTZ, com ação nos receptores 5-HT e GABAA.',
        'UECE',
        'PATENTE',
        '2024-12-10'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Jane Eire Silva Alencar de Menezes', 'Maria Kueirislene Amâncio Ferreira', 'Jesyka Macêdo Guedes', 'Márcia Machado Marinho', 'Emmanuel Silva Marinho', 'Hélcio Silva dos Santos', 'Antonio Wlisses da Silva', 'Maria Geysillene Castro Matos']::varchar[],
        'Fundação Universidade Estadual do Ceará e Universidade Estadual Vale do Acaraú',
        'O diferencial dessa inovação reside na síntese e avaliação de chalconas com potenciais efeitos terapêuticos no Sistema Nervoso Central (SNC), especificamente para tratamento de distúrbios ansiolíticos e anticonvulsivantes. A ausência de toxicidade e os resultados positivos observados com o modelo de Zebrafish destacam essas chalconas como promissoras alternativas terapêuticas.',
        'BR 10 2024 025762 6',
        'BR 10 2024 025762 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2024 025762 6'
          AND p.nome = 'Método de Síntese de Chalconas Sintéticas (CC-2-F, CC-4-Br, CC-4-Cl, CC-4-OCH3) com Propriedades Ansiolíticas e Anticonvulsivantes'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [140/242] PATENTE DE INVENÇÃO (Linha 21) - BR 10 2024 025254 3 - Método para síntese de chalconas sintéticas substituídas e avaliação d
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Método para síntese de chalconas sintéticas substituídas e avaliação de seu potencial ansiolítico em zebrafish',
        'Esta invenção propõe um método para a síntese de chalconas sintéticas substituídas, especificamente 3-nitrofenil, 2,4-diclorofenil e 2,4-dimetoxi, com o objetivo de avaliá-las como agentes ansiolíticos. O estudo investigou seus mecanismos de ação em zebrafish adultos (Danio rerio), focando nos sistemas GABAérgico e serotoninérgico (5HT). As chalconas testadas não apresentaram toxicidade, não afetaram a locomoção dos peixes e demonstraram efeitos ansiolíticos em todos os testes realizados, destacando seu potencial terapêutico.',
        'UECE',
        'PATENTE',
        '2024-12-03'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Jesyka Macêdo Guedes', 'Márcia Machado Marinho', 'Jane Eire Silva Alencar de Menezes', 'Maria Kueirislene Amâncio Ferreira', 'Emmanuel Silva Marinho', 'Hélcio Silva dos Santos']::varchar[],
        'Fundação Universidade Estadual do Ceará e Universidade Estadual Vale do Acaraú',
        'O diferencial dessa patente está na utilização de chalconas sintéticas como novas alternativas terapêuticas para o tratamento de transtornos de ansiedade. A combinação da síntese dessas substâncias com a avaliação de seus efeitos nos sistemas GABAérgico e serotoninérgico, utilizando o modelo de zebrafish, oferece uma abordagem inovadora e eficaz para estudar seus potenciais ansiolíticos.',
        'BR 10 2024 025254 3',
        'BR 10 2024 025254 3',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2024 025254 3'
          AND p.nome = 'Método para síntese de chalconas sintéticas substituídas e avaliação de seu potencial ansiolítico em zebrafish'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [141/242] PATENTE DE INVENÇÃO (Linha 22) - BR 10 2024 025268 3 - Desenvolvimento De Novos Derivados Da Isoniazida Como Agentes Terapêut
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Desenvolvimento De Novos Derivados Da Isoniazida Como Agentes Terapêuticos Para Ansiedade',
        'A invenção refere-se ao processo de síntese de novos derivados hidrazônicos da isoniazida, quimicamente modificados para potencializar seus efeitos no sistema nervoso central, especialmente para o tratamento de ansiedade. A patente descreve os testes realizados para avaliar a toxicidade, segurança e os mecanismos de ação desses novos compostos, justificando seu uso em tratamentos neurológicos. Além disso, compara essas variantes com os tratamentos atuais, destacando vantagens como menor risco de efeitos colaterais e maior eficácia terapêutica.',
        'UECE',
        'PATENTE',
        '2024-12-03'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Emmanuel Silva Marinho', 'Amanda Maria Barros Alves', 'Helcio Silva dos Santos', 'Ivana Carneiro Romão', 'Jane Eire Silva Alencar de Menezes', 'Márcia Machado Marinho', 'Matheus Nunes da Rocha', 'Sonia Maria Costa Siqueira']::varchar[],
        'Fundação Universidade Estadual do Ceará e Universidade Estadual Vale do Acaraú',
        'O diferencial dessa tecnologia está na modificação química da isoniazida para criar derivados com maior eficácia no tratamento de ansiedade, ao mesmo tempo em que reduzem os riscos de efeitos colaterais.',
        'BR 10 2024 025268 3',
        'BR 10 2024 025268 3',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2024 025268 3'
          AND p.nome = 'Desenvolvimento De Novos Derivados Da Isoniazida Como Agentes Terapêuticos Para Ansiedade'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [142/242] PATENTE DE INVENÇÃO (Linha 23) - BR 10 2024 018027 5 - DESENVOLVIMENTO DE NOVOS DERIVADOS DE IBUPROFENO COMO AGENTES TERAPÊUT
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'DESENVOLVIMENTO DE NOVOS DERIVADOS DE IBUPROFENO COMO AGENTES TERAPÊUTICOS PARA ANSIEDADE E CONVULSÃO',
        'A invenção propõe um processo de síntese de novos derivados do ibuprofeno, quimicamente modificados para melhorar seus efeitos no sistema nervoso central, com o objetivo de reduzir os sintomas de ansiedade e controlar convulsões de forma eficaz.',
        'UECE',
        'PATENTE',
        '2024-09-02'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Benise Ferreira da Silva', 'Emmanuel Silva Marinho', 'Francisco Rogênio da Silva Mendes', 'Helcio Silva dos Santos', 'Jane Eire Silva Alencar de Menezes', 'Jéssica Bezerra Maciel', 'Márcia Machado Marinho', 'Maria Kueirislene Amâncio Ferreira', 'Antônio Wlisses da Silva']::varchar[],
        'Fundação Universidade Estadual do Ceará e Universidade Estadual Vale do Acaraú',
        'O diferencial dessa invenção está na modificação química do ibuprofeno, visando otimizar seus efeitos terapêuticos no tratamento de ansiedade e convulsões, ao mesmo tempo que minimiza os riscos de efeitos adversos. A pesquisa oferece uma abordagem inovadora, ampliando as possibilidades terapêuticas do ibuprofeno e demonstrando avanços significativos no desenvolvimento de novos fármacos neurológicos.',
        'BR 10 2024 018027 5',
        'BR 10 2024 018027 5',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2024 018027 5'
          AND p.nome = 'DESENVOLVIMENTO DE NOVOS DERIVADOS DE IBUPROFENO COMO AGENTES TERAPÊUTICOS PARA ANSIEDADE E CONVULSÃO'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [143/242] PATENTE DE INVENÇÃO (Linha 24) - BR 10 2024 017665 0 - COMPOSIÇÃO LÁCTEA FERMENTADA COM PROPRIEDADES BIOCONSERVANTES, PROCESS
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'COMPOSIÇÃO LÁCTEA FERMENTADA COM PROPRIEDADES BIOCONSERVANTES, PROCESSO DE PRODUÇÃO E USO DA COMPOSIÇÃO',
        'A invenção apresenta uma alternativa inovadora para diversificação de produtos lácteos caprinos, com foco em garantir parâmetros sanitários adequados. Trata-se de uma composição láctea com propriedades bioconservantes, obtida por meio da fermentação do leite de cabra, associando prebiótico e edulcorante. O processo utiliza a cultura iniciadora Streptococcus thermophilus QGE e a cultura nativa probiótica Lactiplantibacillus plantarum CNPC001. A tecnologia está inserida no campo de tecnologia de alimentos, oferecendo novas opções de produtos lácteos com benefícios funcionais e bioconservantes naturais.',
        'UECE',
        'PATENTE',
        '2024-08-28'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Flávia Carolina Alonso Buriti', 'Miqueas Oliveira Morais da Silva', 'Ana Paula Albuquerque da Silva', 'Vanderlania do Nascimento Santos', 'Isadora Kaline Camelo Pires de Oliveira Galdino', 'Samuel Carneiro Barcelos', 'Giordanni Cabral Dantas', 'Elainy Virginia dos Santos Pereira', 'Antonio Silvio do Egito Vasconcelos', 'Karina Maria Olbrich dos Santos']::varchar[],
        'Universidade Estadual da Paraiba, Fundação Universidade Estadual do Ceará e Empresa Brasileira de Pesquisa Agropecuária',
        'O diferencial dessa invenção reside na combinação de culturas iniciadoras específicas e probióticas, que não só garantem a segurança alimentar, mas também melhoram as propriedades bioconservantes do produto.',
        'BR 10 2024 017665 0',
        'BR 10 2024 017665 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2024 017665 0'
          AND p.nome = 'COMPOSIÇÃO LÁCTEA FERMENTADA COM PROPRIEDADES BIOCONSERVANTES, PROCESSO DE PRODUÇÃO E USO DA COMPOSIÇÃO'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [144/242] PATENTE DE INVENÇÃO (Linha 25) - BR 10 2024 017701 0 - PROCESSO PRODUTIVO DE PROTEÍNA RECOMBINANTE DO DOMÍNIO RBD DO SARSCOV-
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'PROCESSO PRODUTIVO DE PROTEÍNA RECOMBINANTE DO DOMÍNIO RBD DO SARSCOV-2 FUSIONADO A CAUDA DE HIDROFOBINA UTILIZANDO PLATAFORMA VEGETAL, A PROTEÍNA OBTIDA E O SEU USO',
        'A invenção propõe um método eficiente para a produção de proteína recombinante do domínio RBD do SARS-CoV-2, fusionada à cauda de hidrofobina, utilizando uma plataforma vegetal. O processo inclui a infiltração de folhas de Nicotiana benthamiana com Agrobacterium tumefaciens contendo o plasmídeo de interesse, seguida de coleta e maceração das folhas, semi-purificação com Triton X-114 e avaliação da pureza por eletroforese e Western Blotting.',
        'UECE',
        'PATENTE',
        '2024-08-28'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Daniel Freire Lima', 'Maria Izabel Florindo Guedes', 'Amauri Barbosa da Silva Junior', 'Bruno Bezerra da Silva', 'Reinaldo Barreto Oriá', 'Arnaldo Solheiro Bezerra', 'Mauricio Fraga Van Tilburg', 'Cícero Matheus Lima Amaral', 'Roberio Gomes Olinda']::varchar[],
        'Fundação Universidade Estadual do Ceará e Universidade Federal do Ceará',
        'O diferencial dessa invenção está na utilização da plataforma vegetal para a produção da proteína recombinante do RBD do SARS-CoV-2, combinada com a fusão com hidrofobina, o que melhora significativamente o rendimento, a estabilidade e a facilidade de purificação. A adoção do Sistema Bifásico Aquoso (ATPS) oferece uma solução mais econômica em comparação aos métodos tradicionais de purificação.',
        'BR 10 2024 017701 0',
        'BR 10 2024 017701 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2024 017701 0'
          AND p.nome = 'PROCESSO PRODUTIVO DE PROTEÍNA RECOMBINANTE DO DOMÍNIO RBD DO SARSCOV-2 FUSIONADO A CAUDA DE HIDROFOBINA UTILIZANDO PLATAFORMA VEGETAL, A PROTEÍNA OBTIDA E O SEU USO'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [145/242] PATENTE DE INVENÇÃO (Linha 26) - BR 10 2024 014553 4 - OBTENÇÃO DOS COMPLEXOS DE COORDENAÇÃO DE EURÓPIO (EU 3+ ) E TÉRBIO (TB
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'OBTENÇÃO DOS COMPLEXOS DE COORDENAÇÃO DE EURÓPIO (EU 3+ ) E TÉRBIO (TB 3+ ) COMBINADOS COM LIGANTES Β-DICETONATOS, SULFÓXIDOS, FÁRMACOS E NAFTOQUINONAS COM FINALIDADE ANSIOLÍTICA',
        'A tecnologia refere-se à síntese de compostos químicos à base de Európio (Eu³⁺) e Térbio (Tb³⁺), que são elementos terras raras com propriedades luminescentes e são combinados com ligantes específicos como β-dicetonatos, sulfóxidos, pró-fármacos e naftoquinonas. Esses compostos têm como principal objetivo combater a ansiedade, apresentando atividade ansiolítica. Os compostos de coordenação formados por Európio e Térbio, como [Eu(DBM)₃.(H₂O)₂], [Tb(ACAC)₃.(H₂O)₃], e outros, possuem uma combinação de propriedades químicas e biológicas que proporcionam efeitos terapêuticos. Esses compostos possuem excipientes farmaceuticamente aceitáveis, o que facilita sua formulação em formas medicamentosas viáveis.',
        'UECE',
        'PATENTE',
        '2024-07-16'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Jorge Fernando Silva de Menezes', 'Hélcio Silva dos Santos', 'Aluísio Marques da Fonseca', 'Maria Kueirislene Amâncio Ferreira', 'Jane Eire Silva Alencar de Menezes', 'Emmanuel Silva Marinho', 'Andrei Marcelino Sá Pires Silva']::varchar[],
        'Universidade Federal do Reconcavo da Bahia, Fundação Universidade Estadual do Ceará, Universidade Estadual Vale do Acaraú, Universidade da Integração Internacional da Lusofonia Afro-Brasileira',
        'O diferencial desta tecnologia está na utilização de elementos terras raras como o Európio (Eu³⁺) e o Térbio (Tb³⁺), que possuem características únicas, como alta estabilidade, propriedades luminescentes e a capacidade de formar complexos com ligantes que potenciam suas ações biológicas. A atividade ansiolítica desses compostos pode oferecer um novo caminho para o desenvolvimento de tratamentos para a ansiedade, ampliando as opções terapêuticas no mercado.',
        'BR 10 2024 014553 4',
        'BR 10 2024 014553 4',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2024 014553 4'
          AND p.nome = 'OBTENÇÃO DOS COMPLEXOS DE COORDENAÇÃO DE EURÓPIO (EU 3+ ) E TÉRBIO (TB 3+ ) COMBINADOS COM LIGANTES Β-DICETONATOS, SULFÓXIDOS, FÁRMACOS E NAFTOQUINONAS COM FINALIDADE ANSIOLÍTICA'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [146/242] PATENTE DE INVENÇÃO (Linha 27) - BR 10 2024 013508 3 - Atividade antiviral de aminochalconas sintéticas para controle e trata
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Atividade antiviral de aminochalconas sintéticas para controle e tratamento em infecções ocasionadas por Flavivirus',
        'A invenção descreve a utilização de aminochalconas, substâncias derivadas da biossíntese dos flavonóides, com potencial terapêutico no tratamento de infecções virais, especificamente contra o vírus da Dengue. Essas moléculas foram sintetizadas através da reação de condensação de Claisen-Schmidt. A invenção explora o potencial antiviral das aminochalconas sintéticas, com ênfase na sua aplicação no desenvolvimento de tratamentos para infecções por Dengue.',
        'UECE',
        'PATENTE',
        '2024-07-01'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Maria Izabel Florindo Guedes', 'Danúbio Andrade Bezerra Farias', 'Vânia Marilande Ceccatto', 'Luiz Francisco Wemmenson Gonçalves Moura', 'Vinícius Bandeira Moura', 'Natalia do Vale Canabrava', 'Hélcio Silva dos Santos', 'Emmanuel Silva Marinho', 'Eduarda Nattaly Ferreira Nobre Santos', 'Silvia Aquino Sabongi']::varchar[],
        'Fundação Universidade Estadual do Ceará e Universidade Estadual Vale do Acaraú',
        'O diferencial dessa invenção reside no uso inovador das aminochalconas, moléculas com um amplo espectro de atividades químicas e farmacológicas, no tratamento de infecções virais, especificamente as causadas pelo vírus da Dengue.Além disso, a flexibilidade na forma de administração (oral ou subcutânea) amplia suas opções terapêuticas, oferecendo uma solução inovadora e viável para o combate ao vírus da Dengue e suas variantes.',
        'BR 10 2024 013508 3',
        'BR 10 2024 013508 3',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2024 013508 3'
          AND p.nome = 'Atividade antiviral de aminochalconas sintéticas para controle e tratamento em infecções ocasionadas por Flavivirus'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [147/242] PATENTE DE INVENÇÃO (Linha 28) - BR 10 2024 013373 0 - SÍNTESE, CARACTERIZAÇÃO E ANÁLISE DO POTENCIAL ANSIOLÍTICO, ANTICONVUL
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'SÍNTESE, CARACTERIZAÇÃO E ANÁLISE DO POTENCIAL ANSIOLÍTICO, ANTICONVULSIVANTE E HIPOGLICEMIANTE DA AMINO CHALCONA (E)-1-(4- AMINOPHENYL)-3-PHENYLPROP-2-EN-1-ONE',
        'A invenção descreve o processo de síntese de uma molécula bioativa, especificamente uma chalcona sintética, com potenciais atividades terapêuticas para o tratamento e prevenção de diversas condições, incluindo ansiedade, convulsões, dor, inflamação e diabetes. A tecnologia propõe que o consumo dessa molécula seja feito por indivíduos saudáveis ou não, de forma isolada ou em associação com outras formulações terapêuticas ou componentes de fármacos para administração oral.',
        'UECE',
        'PATENTE',
        '2024-06-28'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Amauri Barbosa da Silva Junior', 'Arnaldo Solheiro Bezerra', 'Emanuela de Lima Rebouças', 'Emmanuel Silva Marinho', 'Hélcio Silva dos Santos', 'Maria Izabel Florindo Guedes', 'Márcia Machado Marinho', 'Antônio Wlisses da Silva']::varchar[],
        'Fundação Universidade Estadual do Ceará e Universidade Estadual Vale do Acaraú',
        'O diferencial dessa invenção está na síntese de uma chalcona com amplo espectro de atividades terapêuticas, abordando múltiplas condições como ansiedade, convulsões, dor, inflamação e diabetes. A molécula sintética oferece uma solução inovadora e eficaz no tratamento de várias doenças, com a flexibilidade de ser consumida isoladamente ou combinada com outras substâncias terapêuticas.',
        'BR 10 2024 013373 0',
        'BR 10 2024 013373 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2024 013373 0'
          AND p.nome = 'SÍNTESE, CARACTERIZAÇÃO E ANÁLISE DO POTENCIAL ANSIOLÍTICO, ANTICONVULSIVANTE E HIPOGLICEMIANTE DA AMINO CHALCONA (E)-1-(4- AMINOPHENYL)-3-PHENYLPROP-2-EN-1-ONE'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [148/242] PATENTE DE INVENÇÃO (Linha 29) - BR 10 2024 012753 6 - Bebida sólida instantânea energética a base de rapadura liofilizada de
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Bebida sólida instantânea energética a base de rapadura liofilizada de cana-de-açúcar para atletas e praticantes de exercícios físicos em recipiente misturador com dispositivo autoperfurante',
        'A invenção refere-se a um design inovador de bebida sólida instantânea energética e funcional, à base de rapadura liofilizada de cana-de-açúcar. Este produto foi desenvolvido para reposição energética, eletrolítica, e para fornecer vitaminas e minerais, além de ter propriedades reidratantes, sendo ideal para praticantes de exercícios físicos de alta e baixa intensidade. A bebida é preparada com água de fontes naturais ou extraída de águas, acondicionada em uma garrafa de polímero com um dispositivo autoperfurante, que conecta a rapadura liofilizada em pó e a água mineral no mesmo recipiente. A composição nutricional é preservada pelo processo de liofilização, garantindo fácil absorção pelo organismo e a reposição metabólica eficiente dos praticantes de exercícios.',
        'UECE',
        'PATENTE',
        '2024-06-21'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Ricardo Lima dos Santos', 'Andrea Vieira Pontes Rohleder', 'Raquel Martins de Freitas', 'Renata Carmo de Assis', 'Stela Mirla da Silva Felipe Acácio', 'Vânia Marilande Ceccatto']::varchar[],
        'Fundação Universidade Estadual do Ceará, Universidade Estadual Vale do Acaraú e Fundação Edson Queiroz',
        'O diferencial dessa invenção está na combinação única de rapadura liofilizada e água mineral, com um dispositivo autoperfurante inovador, que facilita o preparo imediato da bebida energética. O processo de liofilização preserva os nutrientes essenciais, tornando o produto de fácil absorção e eficiente na reposição de energia e hidratação.',
        'BR 10 2024 012753 6',
        'BR 10 2024 012753 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2024 012753 6'
          AND p.nome = 'Bebida sólida instantânea energética a base de rapadura liofilizada de cana-de-açúcar para atletas e praticantes de exercícios físicos em recipiente misturador com dispositivo autoperfurante'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [149/242] PATENTE DE INVENÇÃO (Linha 30) - BR 10 2024 003680 8 - (1R, 2S, 5R) - DODECANOATO DE 2 ISOPROPRIL – 5 –METILCICLOHEXILA: COMP
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        '(1R, 2S, 5R) - DODECANOATO DE 2 ISOPROPRIL – 5 –METILCICLOHEXILA: COMPOSTO DERIVADO DO (-)-MENTOL COM ATIVIDADE ANSIOLÍTICA',
        'A invenção descreve a síntese e caracterização do (1R, 2S, 5R) - dodecanoato de 2 isopropil – 5 –metilciclohexila (B), um éster derivado do mentol (A), com atividade ansiolítica, testada utilizando zebrafish como modelo. A substância foi investigada por sua ação no Sistema Nervoso Central (SNC), onde atua potencializando a ação do neurotransmissor ácido gama-aminobutírico (GABA), o principal neurotransmissor inibitório do cérebro, ligando-se aos receptores GABAA. Este composto surge como uma alternativa aos medicamentos ansiolíticos tradicionais, que frequentemente apresentam resistência e exigem doses maiores com o tempo.',
        'UECE',
        'PATENTE',
        '2024-02-24'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Telma Leda Gomes de Lemos', 'Marcos Carlos de Mattos', 'Francisco José Queiroz Monte', 'Emerson Yvay Almeida de Sousa', 'Maria Daiane de Freitas', 'Artur Ramon Tomé Oliveira', 'Hélcio Silva dos Santos', 'Jane Eire Silva Alencar de Menezes', 'Maria Kueirislene Amâncio Ferreira']::varchar[],
        'Universidade Federal do Ceará, Fundação Universidade Estadual do Ceará e Universidade Estadual Vale do Acaraú',
        'O diferencial dessa invenção está no desenvolvimento do (1R, 2S, 5R) - dodecanoato de 2 isopropil – 5 –metilciclohexila, uma nova molécula com potencial ansiolítico, que atua de maneira semelhante aos medicamentos tradicionais, mas com um mecanismo de ação promissor para o tratamento de transtornos de ansiedade. A invenção propõe uma alternativa para superar o problema da resistência ao tratamento, apresentando um composto inovador que pode oferecer uma solução terapêutica mais eficaz e segura a longo prazo. O uso do modelo de zebrafish para testar a substância reforça sua aplicabilidade e relevância no desenvolvimento de novos tratamentos para doenças relacionadas à ansiedade.',
        'BR 10 2024 003680 8',
        'BR 10 2024 003680 8',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2024 003680 8'
          AND p.nome = '(1R, 2S, 5R) - DODECANOATO DE 2 ISOPROPRIL – 5 –METILCICLOHEXILA: COMPOSTO DERIVADO DO (-)-MENTOL COM ATIVIDADE ANSIOLÍTICA'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [150/242] PATENTE DE INVENÇÃO (Linha 31) - BR 10 2023 021789 3 - Processo de síntese para a obtenção de óxidos de zircônio e níquel mes
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de síntese para a obtenção de óxidos de zircônio e níquel mesoporosos',
        'A presente inovação se concentra na síntese controlada de óxidos mesoporosos de níquel e zircônio, utilizando um método simples. O objetivo é produzir óxidos que apresentem boa cristalinidade, boa resistência térmica e porosidade em escala mesoscópica.',
        'UECE',
        'PATENTE',
        '2023-10-19'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Jesyka Macêdo Guedes', 'Hélcio Silva dos Santos', 'Anne Gabriella Dias Santos', 'Fernando Rodrigo Dantas Fernandes', 'Ewelanny Louyde Ferreira de Lima', 'Miguel Martins dos Santos Neto']::varchar[],
        'Fundação Universidade Estadual do Ceará e Universidade do Estado do Rio Grande do Norte',
        'A tecnologia permite a formação da
estrutura mesoporosa foi obtida com êxito, sem utilizar moldes
rígidos. Por fim, é possível obter óxidos mesoporosos de níquel e
zircônio com boa cristalinidade e resistência térmica, ampliando seu
potencial de aplicação.',
        'BR 10 2023 021789 3',
        'BR 10 2023 021789 3',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2023 021789 3'
          AND p.nome = 'Processo de síntese para a obtenção de óxidos de zircônio e níquel mesoporosos'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [151/242] PATENTE DE INVENÇÃO (Linha 32) - BR 10 2023 021438 0 - Processo para elaboração de um gel energético de carboidratos para pra
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo para elaboração de um gel energético de carboidratos para praticantes de exercício físico e produto gel energético de carboidratos',
        'A presente invenção refere-se a um método para a preparação de um produto de gel de carboidratos. Esse método compreende a preparação da maceração enzimática para fornecimento do produto clarificado de polpas das frutas, e uma etapa de clarificação para retirada das fibras, e outra etapa de concentração para obtenção de um xarope de carboidratos, ao qual é adicionado gelificantes e polissacarídeos.',
        'UECE',
        'PATENTE',
        '2023-10-16'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Renata Carmo de Assis', 'Carla Soraya Costa Maia', 'Ashley Brito Valentim', 'Stela Mirla da Silva Felipe Acácio', 'José Diogo da Rocha Viana', 'Deborah dos Santos Garruti', 'Vania Marilande Ceccatto', 'Carlucio Roberto Alves', 'Andréa Cardoso de Aquino']::varchar[],
        'Fundação Universidade Estadual do Ceará, Universidade Federal do Ceará - Ufc (Br/Ce) e Empresa Brasileira de Pesquisa Agropecuária',
        'Os métodos da presente invenção resultam em um
gel de carboidratos energético à base de jenipapo e banana que tem
níveis elevados de compostos bioativos, bem como mantém sabores
e cores naturais das frutas utilizadas, proporcionando boa
aceitabilidade e recuperação da fadiga muscular causada pela
prática de exercício físico extenuante.',
        'BR 10 2023 021438 0',
        'BR 10 2023 021438 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2023 021438 0'
          AND p.nome = 'Processo para elaboração de um gel energético de carboidratos para praticantes de exercício físico e produto gel energético de carboidratos'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [152/242] PATENTE DE INVENÇÃO (Linha 33) - BR 10 2023 014213 3 - Processo de Obtenção da Chalcona (2e)-1-(4-Metiltien-2-Il)-3-Fenilprop
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Obtenção da Chalcona (2e)-1-(4-Metiltien-2-Il)-3-Fenilprop-2-En-1-Ona Com Atividade Ansiolitica',
        'O presente invento se insere no campo da Química, especialmente aplicada a área de síntese orgânica, descreve o processo de obtenção de chalcona (2E)-1-(4-metiltien-2-il)-3-fenilprop-2-en-1-ona
(1) e seu uso com um possível fármaco ansiolítico.',
        'UECE',
        'PATENTE',
        '2023-07-14'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Telma Leda Gomes de Lemos', 'Iolanda Frota de Farias', 'Francisco José Queiroz Monte', 'Marcos Carlos de Mattos', 'Hélcio Silva dos Santos', 'Maria Daiane de Freitas', 'Renan de Oliveira Gonçalves', 'Maria Kueirislene Amâncio Ferreira', 'Jane Eire Silva Alencar de Menezes']::varchar[],
        'Fundação Universidade Estadual do Ceará e Universidade Federal do Ceará',
        'O composto não apresentou toxicidade e foi ativo nos experimentos de zebrafish
(Danio rerio), nas atividades locomotora, ansiolítica e GABAérgica.',
        'BR 10 2023 014213 3',
        'BR 10 2023 014213 3',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2023 014213 3'
          AND p.nome = 'Processo de Obtenção da Chalcona (2e)-1-(4-Metiltien-2-Il)-3-Fenilprop-2-En-1-Ona Com Atividade Ansiolitica'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [153/242] PATENTE DE INVENÇÃO (Linha 34) - BR 10 2023 014178 1 - Uso de aminochalconas sintéticas no controle e Tratamento de infecções
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Uso de aminochalconas sintéticas no controle e Tratamento de infecções ocasionada por sars-cov 2',
        'As chalconas são biomoléculas oriundas da biossíntese de flavonóides, e com passar dos anos essas substâncias apresentamse cada vez mais promissoras na obtenção de novos compostos com ação farmacológica. Mediante a esse aspecto promissor a invenção em síntese, situa-se dentro de grandes áreas da biotecnologia, biologia molecular e virologia, na qual consiste na síntese invenção situa-se no campo da biotecnologia e virologia e consiste na utilização de chalconas sintéticas que apresentaram atividade com potencial antiviral em SARS- CoV-2. Estas Chalconas foram obtidas através da síntese e condensação de ClaissenSchmidt e são consideradas metabólitos secundários oriundo de biossíntese de flavonóides.',
        'UECE',
        'PATENTE',
        '2023-07-14'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Silvia Aquino Sabongi', 'Paulo Nogueira Bandeira', 'Natália do Vale Canabrava', 'Maria Izabel Florindo Guedes', 'Vinícius Bandeira Moura', 'Hélcio Silva dos Santos', 'Carla Freire Celedonio Fernandes', 'Alexandre Magno Rodrigues Teixeira', 'Mauricio Fraga Van Tilburg', 'Emmanuel Silva Marinho']::varchar[],
        'Fundação Universidade Estadual do Ceará, Universidade Estadual Vale do Acaraú e Fundação Oswaldo Cruz',
        'A aplicabilidade antiviral das chalconas sintéticas propicia o desenvolvimento de novos compostos e formulações com ação terapêutica que podem vir a ser administrada através da via oral na apresentação de pó, comprimidos, capsulas, drágeas, suspensão oral ou mesmo por via subcutânea para tratamento, ou profilaxia de infecções virais associadas ao SARS- CoV-2 e suas variantes.',
        'BR 10 2023 014178 1',
        'BR 10 2023 014178 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2023 014178 1'
          AND p.nome = 'Uso de aminochalconas sintéticas no controle e Tratamento de infecções ocasionada por sars-cov 2'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [154/242] PATENTE DE INVENÇÃO (Linha 35) - BR 10 2023 014199 4 - Aminochalcona halogenada com potencial antichagásico
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Aminochalcona halogenada com potencial antichagásico',
        'Esta invenção mostra a utilização da aminochalcona (E)-1-(4-aminofenil)-3-(2,2-difluorobenzo[d][1,3]dioxol-5-il)prop-2-en-1-ona (DF) contra as formas evolutivas da cepa Y de Trypanosoma cruzi (T. cruzi), protozoário causador da doença de Chagas. Os testes in vitro mostraram uma redução no metabolismo do protozoário em células hospedeiras, enquanto o estudo in silico de docking molecular avaliou essa inibição de crescimento frente a uma das principais enzimas envolvidas no ciclo evolutivo do T. cruzi, a Cruzaína, interagindo no mesmo sítio de ligação que o fármaco de referência Benznidazol (BZN).',
        'UECE',
        'PATENTE',
        '2023-07-14'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Emmanuel Silva Marinho', 'João Victor Serra Nunes', 'Alexandre Magno Rodrigues Teixeira', 'Hélcio Silva dos Santos', 'Paulo Nogueira Bandeira', 'Márcia Machado Marinho', 'Pedro de Lima Neto', 'Emanuelle Machado Marinho', 'Ramon Róseo Paula Pessoa Bezerra de Menezes', 'Alice Maria Costa Martins Nunes']::varchar[],
        'Fundação Universidade Estadual do Ceará, Universidade Vale do Acaraú e Universidade Federal do Ceará',
        'A aminochalcona apresentou maior afinidade pelo receptor em relação ao
Benznidazol. Os resultados da farmacocinética preditiva mostraram um
alinhamento entre atributos como tamanho, lipofilicidade e polaridade
que favorecem sua permeabilidade e que permitem a preparação da
DF como fármaco tripanocida com baixa incidência de toxicidade
orgânica.',
        'BR 10 2023 014199 4',
        'BR 10 2023 014199 4',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2023 014199 4'
          AND p.nome = 'Aminochalcona halogenada com potencial antichagásico'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [155/242] PATENTE DE INVENÇÃO (Linha 36) - BR 10 2023 011589 6 - Formulação de Fitoterápico de Combretum Lanceolatum Pohl. com Efeito A
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Formulação de Fitoterápico de Combretum Lanceolatum Pohl. com Efeito Ansiolítico, Hipoglicemiante, Antinociceptivo e Anti-Inflamatório',
        'Pesquisas são realizadas para identificação de novos compostos com ação ansiolítica, hipoglicemiante, antinociceptiva e anti-inflamatória para o desenvolvimento de novos tratamentos com menos efeitos colaterais. O foco são os produtos naturais e seus derivados, com efeitos adversos reduzidos e maior eficácia no tempo de ação.',
        'UECE',
        'PATENTE',
        '2023-06-13'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Alexandre Magno Rodrigues Teixeira', 'Antonio Wlisses da Silva', 'Jane Eire Silva Alencar de Menezes', 'Emmanuel Silva Marinho', 'Márcia Machado Marinho', 'Maria Kueirislene Amâncio Ferreira', 'Emanuela de Lima Rebouças', 'Francisco Rogênio da Silva Mendes', 'Hélcio Silva dos Santos']::varchar[],
        'Fundação Universidade Estadual do Ceará e Universidade Vale do Acaraú',
        'A formulação de fitoterápico derivado de Combretum
lanceolatum Pohl pode apresentar menor custo que os
medicamentos convencionais, e menos efeitos adversos quando
comparado aos fármacos de primeira linha para o tratamento da
ansiedade, quadros de hiperglicemia, dor e inflamação.',
        'BR 10 2023 011589 6',
        'BR 10 2023 011589 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2023 011589 6'
          AND p.nome = 'Formulação de Fitoterápico de Combretum Lanceolatum Pohl. com Efeito Ansiolítico, Hipoglicemiante, Antinociceptivo e Anti-Inflamatório'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [156/242] PATENTE DE INVENÇÃO (Linha 37) - BR 10 2023 008233 5 - Formulação, Processo de Obtenção e uso de Nanoemulsões dos Polissacarí
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Formulação, Processo de Obtenção e uso de Nanoemulsões dos Polissacarídeos do Cogumelo Agaricus Blazei Murill Contendo o Complexo de Ácido Tânico-Cobre(Ii) Carreado',
        'A presente invenção se aplica ao campo da farmácia, química e medicina, onde a mesma descreve o processo de formulação de nanoemulsão contendo polissacarídeos extraídos do cogumelo Agaricus brasiliensis ou Agaricus blazei Murill ou Agaricus subrufescens Peck, da composição, e uso da formulação como agente encapsulante, em que os polissacarídeos isolados também desempenham função terapêutica com ação cicatrizante e antioxidante. Ademais, a presente invenção tem como objetivo encapsular o complexo ácido tânico-cobre (II) em nanoemulsão, contendo ácido oleico como fase oleosa,F127 como emulsificante e polissacarídeos extraídos do cogumelo Agaricus brasiliensis como agente de estabilização, com o objetivo de utilizar esta formulação no tratamento tópico de feridas.',
        'UECE',
        'PATENTE',
        '2023-04-28'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Nágila Maria Pontes Silva Ricardo', 'Sandra de Aguiar Soares', 'Maria Elenir Nobre Pinho Ribeiro', 'Rafael Lima Saraiva', 'João Francisco Câmara Neto', 'Matheus Da Silva Campelo', 'Thaís Araújo Gomes Ferreira', 'Wildson Max Barbosa Da Silva', 'Solange de Oliveira Pinheiro']::varchar[],
        'Fundação Universidade Estadual do Ceará e Universidade Federal do Ceará',
        'A inovação da presente invenção reside no fato de que os polissacarídeos do cogumelo Agaricus brasiliensis ou Agaricus blazei Murill ou Agaricus subrufescens Peck, de acordo com o processo descrito na presente invenção, apresenta ação cicatrizante, e adicionalmente atua como estabilizante de um sistema nanoemulsionado contendo complexo ácido tânico-cobre (II), em que o ácido tânico coordenado ao íon de Cu 2+ é o ligante, favorecendo sua aplicação tópica, representando uma opção para desenvolvimento de diferentes formas farmacêuticas para tratamento de feridas (úlcera diabética e leishmaniose tegumentar) e aplicação cosmética.',
        'BR 10 2023 008233 5',
        'BR 10 2023 008233 5',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2023 008233 5'
          AND p.nome = 'Formulação, Processo de Obtenção e uso de Nanoemulsões dos Polissacarídeos do Cogumelo Agaricus Blazei Murill Contendo o Complexo de Ácido Tânico-Cobre(Ii) Carreado'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [157/242] PATENTE DE INVENÇÃO (Linha 38) - BR 10 2023 003773 9 - Covid-Array: Kit Para Análise de Fenótipo da Expressão Diferencial de 
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Covid-Array: Kit Para Análise de Fenótipo da Expressão Diferencial de Genes Envolvidos nas Lesões Inflamatorias da Covid-19 em Tecido Cardíaco',
        'A presente invenção descreve uma técnica a partir de um teste aqui denominado de Covid-19-array para avaliação do grau de risco inflamatório, baseado na determinação das assinaturas de expressões gênicas. Assim, o teste visa avaliar os possíveis efeitos da covid-19 em tecido cardíaco com a utilização de bancos dados de genes transcritos significativos, passíveis de serem avaliados, os quais poderiam oferecer um escore gênico para o fenótipo do indivíduo fisicamente mais suscetível a inflamações cardíacas causadas pela covid-19, o escore, seria obtido pela comparação entre um amostra de um indivíduo a ser investigado e uma amostra padrão que será fornecida por uma amostra de paciente que veio a óbito por complicações devido a inflamações cardíacas decorrente da covid-19. A presente invenção, inventivamente provê um kit e um processo que permite a realização do teste Covid-19-array.',
        'UECE',
        'PATENTE',
        '2023-02-28'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Luiz Henrique Pontes dos Santos', 'Juliana Osório Alves', 'Raquel Martins de Freitas', 'Stela Mirla Da Silva Felipe', 'Vânia Marilande Ceccatto']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'As principais aplicações do teste Covid-array encontram-se no ramo da medicina. O kit pode ser utilizado por médicos para avaliar o grau de risco do desenvolvimento de lesões cardíacas decorrente da covid-19. Nessa perspectiva, o presente invento traz pode guiar tratamentos para um determinado paciente com maior grau de risco.',
        'BR 10 2023 003773 9',
        'BR 10 2023 003773 9',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2023 003773 9'
          AND p.nome = 'Covid-Array: Kit Para Análise de Fenótipo da Expressão Diferencial de Genes Envolvidos nas Lesões Inflamatorias da Covid-19 em Tecido Cardíaco'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [158/242] PATENTE DE INVENÇÃO (Linha 39) - BR 10 2023 000100 9 - Aminochalcona Sintética com Potencial Antichagásico
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Aminochalcona Sintética com Potencial Antichagásico',
        'Esta invenção mostra a utilização da aminochalcona (E)-1-(4-aminofenil)-3-(2,2-difluorobenzo[d][1,3]dioxol-5-il) prop-2-en-1-ona (DF) contra as formas evolutivas da cepa Y de Trypanosoma cruzi (T. cruzi), protozoário causador da doença de Chagas.',
        'UECE',
        'PATENTE',
        '2023-01-03'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Emmanuel Silva Marinho', 'João Victor Serra Nunes', 'Alexandre Magno Rodrigues Teixeira', 'Hélcio Silva dos Santos', 'Paulo Nogueira Bandeira', 'Márcia Machado Marinho', 'Emanuelle Machado Marinho', 'Alice Maria Costa Martins Nunes', 'Ramon Róseo Paula Pessoa Bezerra de Menezes', 'Pedro de Lima Neto']::varchar[],
        'Fundação Universidade Estadual do Ceará, Universidade Federal do Ceará e Universidade Estadual Vale do Acaraú',
        'Os testes in vitro mostraram uma redução no metabolismo do protozoário em células hospedeiras, enquanto o estudo in silico de docking molecular avaliou essa inibição de crescimento frente a uma das principais enzimas envolvidas no ciclo evolutivo do T. cruzi, a Cruzaína, interagindo no mesmo sítio de ligação que o fármaco de referência Benznidazol (BZN). A aminochalcona apresentou maior afinidade pelo receptor em relação ao Benznidazol.',
        'BR 10 2023 000100 9',
        'BR 10 2023 000100 9',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2023 000100 9'
          AND p.nome = 'Aminochalcona Sintética com Potencial Antichagásico'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [159/242] PATENTE DE INVENÇÃO (Linha 40) - BR 10 2023 000027 4 - Hipomirs: Estratégia Múltipla Para A Terapêutica Hipoglicemiante de Di
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Hipomirs: Estratégia Múltipla Para A Terapêutica Hipoglicemiante de Diabetes Mellitus Tipo 2 Via Antagomirs Em Humanos, Ratos E Camudongos',
        'A presente invenção esta concentrada no campo da biotecnologia, biologia
molecular e medicina, se trata de um método de tratamento para diabetes mellitus do
tipo 2 via inibição de miRNAs. Essa abordagem conta com inibidores de miRNAs
específicos (miR-29b, miR-15b, miR-103, miR-107, miR-222 e miR-144) relacionados a
modulação por silenciamento gênico pós transcricional, essas moléculas regulam genes
que atuam na melhora do metabolismo da insulina e captação da glicose na condição de
diabetes mellitus tipo 2. A metodologia conta com oligonucleotídeos inibidores
(antagomiRs) modificados para eficiência na função, aos quais contam com uma grande
complementaridade com os miRNAs alvos. Exossomos, aptâmeros, lipossomos, vetores
virais e plasmídeos, mas não exclusivamente, são os carreadores dos antagomiRs para
administração a tecidos e receptores específicos. O enfoque é administrar esses
antagomirs ao tecido muscular e adiposo, aos quais sãos os mais afetados pelo diabetes
mellitus tipo 2.',
        'UECE',
        'PATENTE',
        '2023-02-03'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Raquel Martins de Freitas', 'Jannison Karlly Cavalcante Ribeiro', 'Jefferson Pacheco Amaral Fortes', 'Stela Mirla Da Silva Felipe', 'Vânia Marilande Ceccatto']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Essa terapêutica tem uma perspectiva de durabilidade de efeitos melhor
que os tratamentos medicamentosos disponíveis atualmente, aos quais precisam de uso
diário. Além disso, a abordagem é alvo e tecido específica, diminuindo as possibilidades
de ocasionar efeitos em outros sistemas e consequentes efeitos adversos e colaterais.
Nessa perspectiva, o presente invento traz uma nova concepção de tratamentos para a
desordem com um enfoque molecular específico.',
        'BR 10 2023 000027 4',
        'BR 10 2023 000027 4',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2023 000027 4'
          AND p.nome = 'Hipomirs: Estratégia Múltipla Para A Terapêutica Hipoglicemiante de Diabetes Mellitus Tipo 2 Via Antagomirs Em Humanos, Ratos E Camudongos'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [160/242] PATENTE DE INVENÇÃO (Linha 41) - BR 10 2022 011105 7 - Chalcona Sintética Obtida de Produto Natural Para Tratamento de Diabet
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Chalcona Sintética Obtida de Produto Natural Para Tratamento de Diabetes Mellitus, Inflamação E Nocicepção',
        'Faz- se necessário a busca por novos fármacos ou componentes de formulações medicamentosas
com estudos promissores para o tratamento e prevenção de doenças. A invenção se situa no
campo da biotecnologia com ênfase em saúde e indica processo de síntese de uma molécula
proveniente de produto natural com atividades promissores no tratamento da dor, inflamação
e diabetes. A chalcona foi obtida através da síntese e condensação de Claisen-Schmidt e são
consideradas metabólitos secundários oriundo de biossíntese de flavonóides.',
        'UECE',
        'PATENTE',
        '2022-06-07'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Maria Kueirislene Amâncio Ferreira', 'Francisco Rogênio Da Silva Mendes', 'Antonio Wlisses Da Silva', 'Jane Eire Silva Alencar de Menezes', 'Emmanuel Silva Marinho', 'Márcia Machado Marinho', 'Matheus Nunes Da Rocha', 'Hélcio Silva dos Santos']::varchar[],
        'Fundação Universidade Estadual do Ceará e Universidade Estadual Vale do Acaraú',
        'Esta invenção é considerada relevante porque tem como estratégia a síntese de forma prática e eficiente de uma
molécula contendo estrutura de produto natural, uma das formas que permite a exploração de
relação estrutura-atividade (SAR), a qual vem sendo bastante difundida. Com base na aplicação
da molécula, pode ser usada em formulações terapêuticas ou componentes de fármacos sobre
administração oral. O consumo deve ser realizado pelos indivíduos que possuem alguma patologia
mencionada nesta invenção (dor; inflamação ou diabetes).',
        'BR 10 2022 011105 7',
        'BR 10 2022 011105 7',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2022 011105 7'
          AND p.nome = 'Chalcona Sintética Obtida de Produto Natural Para Tratamento de Diabetes Mellitus, Inflamação E Nocicepção'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [161/242] PATENTE DE INVENÇÃO (Linha 42) - BR 10 2022 010630 4 - Aminochalconas Como Potencializadora Da Atividade de Antimicrobianos
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Aminochalconas Como Potencializadora Da Atividade de Antimicrobianos',
        'Esta invenção está destinado as indústrias farmacêuticas e busca pesquisar compostos sintéticos
eficazes contra a resistência antibacteriana usando as aminochalconas: (2E,4E)-1-(4-aminofenil)-5-
fenilpenta-2,4- dien-1-ona (PA-CNM) e (E)-1-(3-aminofenil)-3-fenilprop-2-en-1-ona (PA-NITRO) que
revelaram atividade antibacteriana promissoras quando associadas a gentamicina, ampicilina
e ciprofloxacina, contra cepas multirresistentes de Staphylococcus aureus e de Escherichia coli.
Patentes anteriores não usam as mesmas substâncias com atividades potencializadoras.',
        'UECE',
        'PATENTE',
        '2022-05-31'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Alexandre Magno Rodrigues Teixeira', 'Paula Hemília de Souza Nunes', 'Hélcio Silva dos Santos', 'Henrique douglas Melo Coutinho', 'Janaina Esmeraldo Rocha', 'Paulo Nogueira Bandeira', 'Silvia Sousa Aquino', 'Thiago Sampaio de Freitas', 'Emmanuel Silva Marinho', 'Márcia Machado Marinho']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Para avaliar a atividade antibacteriana foram realizados testes de modulação e de expressões de
bomba de efluxo. No controle da ampicilina sobre o taphylococcus aureus e a Escherichia coli,
houve um mecanismo inativando a ß-lactamase contra esse antibiótico. Quanto a Escherichia
coli, a associação da ampicilina com a sulbactam mostra um mecanismo de ß-lactamase.',
        'BR 10 2022 010630 4',
        'BR 10 2022 010630 4',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2022 010630 4'
          AND p.nome = 'Aminochalconas Como Potencializadora Da Atividade de Antimicrobianos'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [162/242] PATENTE DE INVENÇÃO (Linha 43) - BR 10 2022 010657 6 - Chalcona Sintética Com Potencial Para Tratamento Da doença de Chagas
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Chalcona Sintética Com Potencial Para Tratamento Da doença de Chagas',
        'Esta invenção mostra a utilização da chalcona (2E)-3-(2-fluorofenil)-1-(2-hidroxi-3,4,6-trimetoxifenil)
prop-2-en-1-ona (CPN2F) contra o protozoário Trypanosoma cruzi (T. cruzi) causador da doença de
Chagas. Seu uso associado ao Benznidazol, indica interações com enzimas importantes do ciclo
evolutivo do T. cruzi, mostrando uma redução no metabolismo das suas três formas evolutivas
(epimastigota, tripomastigota e amastigota). Os testes in vitro mostraram uma redução no
metabolismo do protozoário em células hospedeiras, enquanto os modelos de molecular docking
avaliaram essa inibição de crescimento através do efeito sinérgico associado ao Benznidazole,
frente aos principais alvos do ciclo evolutivo do T. cruzi (Cruzaína TcGAPDH e Tripanotiona
redutase).',
        'UECE',
        'PATENTE',
        '2022-05-31'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Carlos Henrique Leitão Cavalcante', 'Hélcio Silva dos Santos', 'Emmanuel Silva Marinho', 'Márcia Machado Marinho', 'Paulo Nogueira Bandeira', 'Alice Maria Costa Martins Nunes', 'Ramon Róseo Paula Pessoa Bezerra de Menezes', 'Tiago Lima Sampaio', 'Pedro de Lima Neto', 'Emanuel Paula Magalhães']::varchar[],
        'Fundação Universidade Estadual do Ceará/ Universidade Federal do Ceara / Universidade Estadual Vale do Acaraú / Instituto Federal de Educação, Ciência E Tecnologia do Ceara',
        'Os resultados da predição in silico revelaram um alinhamento entre os atributos
farmacocinéticos, como absorção e liberação renal, que permitem a preparação do CPN2F como
fármaco antichagásico com baixa incidência de toxicidade orgânica.',
        'BR 10 2022 010657 6',
        'BR 10 2022 010657 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2022 010657 6'
          AND p.nome = 'Chalcona Sintética Com Potencial Para Tratamento Da doença de Chagas'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [163/242] PATENTE DE INVENÇÃO (Linha 44) - BR 10 2022 009016 5 - Antimicrobiano de Piperina Com Óxido de Zinco E Eugenol
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Antimicrobiano de Piperina Com Óxido de Zinco E Eugenol',
        'A presente invenção trata de um antimicrobiano para uso odontológico na restauração e
tratamento de dentes cariados. Apresenta-se uma solução com adição de 4% de piperina na
composição do óxido de zinco e eugenol, com maior eficiência no combate a microrganismos
comuns da cavidade oral.',
        'UECE',
        'PATENTE',
        '2022-05-10'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Humbérila da Costa e Silva Melo', 'José Luiz Silva Sá', 'Francisca Lúcia Lima', 'Robson Almeida Borges de Freitas']::varchar[],
        'Fundação Universidade Estadual do Ceará, Instituto Federal de Educação, Ciência E Tecnologia do Piauí / Universidade Estadual do Piauí',
        'O diferencial tecnológico dessa invenção está na incorporação da piperina, em uma concentração de 4%, à composição do óxido de zinco e eugenol. A piperina é um alcaloide encontrado em pimenta-do-reino, conhecida por suas propriedades antimicrobianas e anti-inflamatórias.',
        'BR 10 2022 009016 5',
        'BR 10 2022 009016 5',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2022 009016 5'
          AND p.nome = 'Antimicrobiano de Piperina Com Óxido de Zinco E Eugenol'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [164/242] PATENTE DE INVENÇÃO (Linha 45) - BR 10 2021 024259 0 - Processo de Extração, Encapsulamento E Aplicação Terapêutica de Compos
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Extração, Encapsulamento E Aplicação Terapêutica de Compostos Bioativos de Plantas do Gênero Abelmoschus',
        'As doenças crônicas não transmissíveis (DCNT) representam um crescente e grave problema de saúde pública para todos os países, independentemente do seu grau de desenvolvimento econômico. Diversos fármacos já foram desenvolvidos para atuarem no tratamento dessas patologias. No entanto, os medicamentos, não são suficientes para cobrir toda a sintomatologia e ainda podem gerar efeitos colaterais devido a necessidade do uso prologando. Diante disso, é evidente a necessidade de tratamentos alternativos e/ou complementares que atenuem as implicações econômicas e aumentem a qualidade de vida dos portadores de DCNT. Diversas plantas com potencial nutracêutico, vêm sendo utilizadas no tratamento alternativo e profilaxia de diversas patologias.',
        'UECE',
        'PATENTE',
        '2021-12-01'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Ana Paula Apolinário da Silva', 'José Ytalo Gomes da Silva', 'Eridan Orlando Pereira Tramontina Florean', 'Luiz Francisco Wemmenson Gonçalves Moura', 'Bruno Bezerra da Silva', 'Helen Paula Silva da Costa', 'João Xavier da Silva Neto', 'Daniele de Oliveira Bezerra de Sousa', 'Maria Izabel Florindo Guedes']::varchar[],
        'Fundação Universidade Estadual do Ceará, Universidade Federal do Ceará, Greenbean Biotecnologia',
        'Uma formulação, compreendendo um teor padronizado de pó e contendo diversos compostos bioativos das diferentes partes (hidrossolúveis e não hidrossolúveis), combinadas entre si ou isoladas, de plantas do gênero Abelmoschus, se mostra promissora para uso nutracêutico em composições farmacêuticas por vias adequadas, em particular nas apresentações para uso oral. A referida composição inclui, mas não se limita a extração de materiais por processos à base de água em conjunto ou não com outro solvente, embebendo partes da planta após a secagem à frio ou em estufa por 3 dias. A formulação pode ser utilizada para profilaxia e tratamento de algumas patologias, tais como DCNT e suas complicações.',
        'BR 10 2021 024259 0',
        'BR 10 2021 024259 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2021 024259 0'
          AND p.nome = 'Processo de Extração, Encapsulamento E Aplicação Terapêutica de Compostos Bioativos de Plantas do Gênero Abelmoschus'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [165/242] PATENTE DE INVENÇÃO (Linha 46) - BR 10 2021 024146 2 - Potencial Nutraceutico de Uma Proteína Isolada de Cnidoscolus Quercifo
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Potencial Nutraceutico de Uma Proteína Isolada de Cnidoscolus Quercifolius Poh (Faveleira, Euphorbiaceae) No Tratamento do Diabetes',
        'Atualmente, grandes são esforços na investigação do diabetes mellitus, uma patologia complexa
e multifatorial de elevada morbidade e mortalidade. Uma proteína mimética a insulina ou isolado
proteicos de partes Cnidoscolus quercifolius pohl tem o potencial hipoglicemiante. Inicialmente
as sementes coletadas foram delipidadas e homogeinezada em tampão de extração Tris-HCl,
pH 7,5 contendo NaCl, na proporção de 1:10 (m/v) por 3 horas (4 oC) e filtrados, em seguidas
centrifugados a 10.000 x g (30 min, 4 °C) e submetido à diálise. O extrato foi submetido a sucessivos
passos cromatográficos bioquiados por dot bloting até a purificação de uma proteína.',
        'UECE',
        'PATENTE',
        '2021-11-30'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Luiz Francisco Wemmenson Gonçalves Moura', 'Helen Paula Silva da Costa', 'Maria Izabel Florindo Guedes', 'João Xavier da Silva Neto']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A amostra mostrou uma atividade hipoglicêmica em um ensaio in vitro com linha celular responsiva a
insulina RIN 5f. Além disso, esta proteína apresentou propriedade hipoglicêmica oral in vivo em
camundongos diabéticos induzidos por aloxona pelo teste de dose única. O Cq-PTI não causou
citotoxicidade para célula Vero, não apresentou atividade alergênica.',
        'BR 10 2021 024146 2',
        'BR 10 2021 024146 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2021 024146 2'
          AND p.nome = 'Potencial Nutraceutico de Uma Proteína Isolada de Cnidoscolus Quercifolius Poh (Faveleira, Euphorbiaceae) No Tratamento do Diabetes'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [166/242] PATENTE DE INVENÇÃO (Linha 47) - BR 10 2022 026345 0 - O Uso do Anti-Hipertensivo Hidralazina (Hdz) Como Novo Modelo Para Tra
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'O Uso do Anti-Hipertensivo Hidralazina (Hdz) Como Novo Modelo Para Tratamento de Infecções Bacterianas',
        'A resistência bacteriana a antibióticos, é considerado um problema de saúde pública a nível
mundial. Nas últimas décadas um número crescente de infecções bacterinas tem surgido de
modo exponencial e consequentemente aumentado os números de morbidade, mortalidade,
além da elevação significativa dos custos hospitalares. Embora se tenha buscado novos agentes
antibacterianos ao longo dos anos, o desenvolvimento de genes de resistência, tem aumentado
substancialmente e se faz necessária a busca constante de novos agentes terapêuticos para o
tratamento de infecções bacterianas. Baseado neste cenário o reposicionamento de fármacos
pode ser uma alternativa eficiente no combate a infecções bacterianas. Assim, a presente invenção,
demonstra a possibilidade de uso da hidralazina, um fármaco anti-hipertensivo, reposicionado
para o tratamento de infecções causadas por Staphylococcus aureus, Streptococcus mutans,
Escherichia coli e Klebsiella pneumoniae.',
        'UECE',
        'PATENTE',
        '2022-12-22'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Hélcio Silva dos Santos', 'Antônio Mateus Gomes Pereira', 'Victor Alves Carneiro', 'Renata Albuquerque Costa', 'Benise Ferreira da Silva', 'Paulo Adenes Teixeira Coelho', 'Emmanuel Silva Marinho', 'Márcia Machado Marinho']::varchar[],
        'Fundação Universidade Estadual do Ceará/ / Universidade Estadual Vale do Acaraú / Universidade Federal do Ceará / Centro Universitário Inta',
        '. Os resultados obtidos demonstraram que a hidralazina tem potencial de uso promissor isolada ou em combinação com a gentamicina, no combate a
bactérias Gram-positivas e Gramnegativas.',
        'BR 10 2022 026345 0',
        'BR 10 2022 026345 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2022 026345 0'
          AND p.nome = 'O Uso do Anti-Hipertensivo Hidralazina (Hdz) Como Novo Modelo Para Tratamento de Infecções Bacterianas'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [167/242] PATENTE DE INVENÇÃO (Linha 48) - BR 10 2022 026380 9 - Chalconas Sintéticas Com Atividade Citotóxica Contra Linhagens de Célu
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Chalconas Sintéticas Com Atividade Citotóxica Contra Linhagens de Células Tumorais Humanas',
        'A presente invenção faz parte do campo da biotecnologia e oncologia, consistindo na utilização
de chalconas sintéticas denominadas de: (E)-3-(2-furan-2-il) -1-(2-hidroxi3,4,6-trimetoxi-fenil)prop
-2-en-1-ona(CPNFURFURAL) e (E)-3-(4- clorofenil)-1-(2-hidroxi-3,4,6-trimetoxifenil) prop-2-en-1-
ona (CPN4CL). Vale ressaltar que as Chalconas foram obtidas através da síntese e condensação
de Claisen-Schmidt e são considerados metabólitos secundários oriundas da biossíntese de
flavonóides. A invenção em questão consiste na utilização farmacológica destes compostos que
apresentaram atividade antineoplásica realizada em três linhagens de células tumorais: SNB-19
(Astrocitoma-Cérebro Humano), PC3 (Próstata) e HCT-116 (Cólon do útero).',
        'UECE',
        'PATENTE',
        '2022-12-22'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Wandresa Francelino Pereira', 'Alexandre Magno Rodrigues Teixeira', 'Hélcio Silva dos Santos', 'Paulo Nogueira Bandeira', 'Silvia Sousa Aquino', 'Guilherme Graziany Camelo de Carvalho', 'Emmanuel Silva Marinho', 'Márcia Machado Marinho']::varchar[],
        'Fundação Universidade Estadual do Ceará, Universidade Federal do Ceará, Universidade Estadual Vale do Acaraú',
        'Diante dos resultados
obtidos, abrem espaço para que no futuro, com essas propriedades farmacológicas comprovadas,
a ciência baseada em chalconas heterocíclicas seja aplicada na descoberta de drogas.',
        'BR 10 2022 026380 9',
        'BR 10 2022 026380 9',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2022 026380 9'
          AND p.nome = 'Chalconas Sintéticas Com Atividade Citotóxica Contra Linhagens de Células Tumorais Humanas'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [168/242] PATENTE DE INVENÇÃO (Linha 49) - BR 10 2022 018023 7 - Instrumento Cirúrgico Para Retificação Da Columela Nasal Na Rinomodela
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Instrumento Cirúrgico Para Retificação Da Columela Nasal Na Rinomodelação',
        'Patente de Invenção de material na área de biotecnologia, indústria de transformação, setor
de fabricação de materiais para uso em medicina, com aplicabilidade na injeção de implantes
infiltrativos na porção distal do nariz, com aplicação especialmente no procedimento de
rinomodelação. Consiste em ferramenta caracterizada por uma haste proximal que é conectada
lateral e distalmente pelo corpo do instrumento a duas hastes laterais paralelas entre si e à anterior,
cujas porções distais, por sua vez, se dobram anteriormente em um ângulo fechado (lembrando
um L).',
        'UECE',
        'PATENTE',
        '2022-09-09'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Fabiano Nadson Magacho Vieira', 'José Henrique Leal Cardoso']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O tamanho do instrumento, a proporção entre o comprimento das hastes, o ângulo e a
distância entre elas também podem variar. A invenção pode ser construída em diferentes materiais
rígidos ou semi-flexíveis como, por exemplo, plástico, acrílico, vidro, resina ou metal.',
        'BR 10 2022 018023 7',
        'BR 10 2022 018023 7',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2022 018023 7'
          AND p.nome = 'Instrumento Cirúrgico Para Retificação Da Columela Nasal Na Rinomodelação'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [169/242] PATENTE DE INVENÇÃO (Linha 50) - BR 10 2021 024155 1 - Uso de Uma Solução/ Emulsão A Partir de Ziziphus Cotinifolia Reissek N
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Uso de Uma Solução/ Emulsão A Partir de Ziziphus Cotinifolia Reissek No Tratamento dos Transtornos Da Ansiedade',
        'As doenças crônicas não transmissíveis (DCNT) representam um crescente e grave problema de saúde pública para todos os países, independentemente do seu grau de desenvolvimento econômico. Diversos fármacos já foram desenvolvidos para atuarem no tratamento dessas patologias. No entanto, os medicamentos, não são suficientes para cobrir toda a sintomatologia e ainda podem gerar efeitos colaterais devido a necessidade do uso prologando. Diante disso, é evidente a necessidade de tratamentos alternativos e/ou complementares que atenuem as implicações econômicas e aumentem a qualidade de vida dos portadores de DCNT. Diversas plantas com potencial nutracêutico, vêm sendo utilizadas no tratamento alternativo e profilaxia de diversas patologias. Uma formulação, compreendendo um teor padronizado de extratos de folhas e galhos, contendo diversos compostos bioativos das diferentes partes (hidrossolúveis e não hidrossolúveis), combinadas entre si ou isoladas, de plantas da espécie Ziziphus cotinifolia Reissek, se mostra promissora para uso terapêutico em composições farmacêuticas por vias adequadas, em particular nas apresentações para uso oral.',
        'UECE',
        'PATENTE',
        '2021-11-30'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Maria Izabel Florindo Guedes', 'Djane Ventura de Azevedo', 'Francisco Ernani Alves Magalhães', 'Eridan Orlando Pereira Tramontina Florean', 'Luiz Francisco Wemmenson Gonçalves Moura', 'Helen Paula Silva da Costa', 'Bruno Bezerra da Silva', 'João Xavier da Silva Neto', 'José Ytalo Gomes da Silva']::varchar[],
        'Fundação Universidade Estadual do Ceará/ Greenbean Biotecnologia',
        'A referida composição inclui, mas não se limita a extração de materiais por processos à base de água em conjunto ou não com outro solvente, embebendo partes da planta após a secagem à frio ou em estufa por 3 dias. A formulação pode ser utilizada para profilaxia e tratamento de transtornos de ansiedade e suas complicações.',
        'BR 10 2021 024155 1',
        'BR 10 2021 024155 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2021 024155 1'
          AND p.nome = 'Uso de Uma Solução/ Emulsão A Partir de Ziziphus Cotinifolia Reissek No Tratamento dos Transtornos Da Ansiedade'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [170/242] PATENTE DE INVENÇÃO (Linha 51) - BR 10 2021 024159 4 - Fitoterápico A Base do Extrato Aquoso Liofilizado de Ouratea Fieldingi
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Fitoterápico A Base do Extrato Aquoso Liofilizado de Ouratea Fieldingiana (Gardner) Engl. (Batiputá) Para O Tratamento de Inflamação Tópica E Sistêmica',
        'Trata-se da utilização do extrato etanólico da batiputá (Ouratea fieldingiana) no tratamento de
inflamações tópicas e sistêmicas. A formulação do fármaco contém o extrato, obtido a partir
das folhas da batiputá cuja ação anti-inflamatória foi verificada em modelos in vitro e in vivo.
dentre os mecanismos de ação investigados destacam-se: o efeito de hipernocicepção, edema e
migração de leucócitos. A atividade antinociceptiva no teste de hiperalgesia abdominal ocorreu
desde a primeira hora, durando cerca de 4h após a administração oral a 10 mg/kg.',
        'UECE',
        'PATENTE',
        '2021-11-30'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Selene Maia de Morais', 'Lucas Soares Frota', 'Francisco Glerison da Silva Nascimento', 'Ana Maria Sampaio Assereuy']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'No modelo
de edema de pata, o efeito anti-edematogênico foi expressivo nas duas fases induzidas pelo
agente flogístico carragenana. No modelo de peritonite houve relevante redução da migração de
leucócitos, especialmente os neutrófilos. Foi ainda evidente a redução da enzima mieloperoxidase
(MPO), além de efeito em importantes marcadores, tais como MDA (marcador de peroxidação
lipídica), e marcadores de atividade antioxidante, catalase e GSH.',
        'BR 10 2021 024159 4',
        'BR 10 2021 024159 4',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2021 024159 4'
          AND p.nome = 'Fitoterápico A Base do Extrato Aquoso Liofilizado de Ouratea Fieldingiana (Gardner) Engl. (Batiputá) Para O Tratamento de Inflamação Tópica E Sistêmica'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [171/242] PATENTE DE INVENÇÃO (Linha 52) - BR 10 2021 024173 0 - Processo de Produção de Antigenos E Anticorpos Para desenvolvimento Di
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Produção de Antigenos E Anticorpos Para desenvolvimento Diagnóstico de Sars-Cov-2 Em Saliva E Outras Secreções',
        'A presente invenção descreve um processo de produção de anticorpos para o vírus SARS-Cov-2
inativado, padronização da técnica sorológica de baixo custo para diagnóstico da COVID-19,
utilizando o método de dot blot, para detectar a presença do antígeno viral na saliva. Essa nova
metodologia apresenta vantagem em relação aos métodos que detectam ácidos nucleicos como
o RT-PCR, ou detecção de anticorpos utilizando proteínas recombinantes, uma vez que a invenção
aqui apresentada detecta a presença do vírus (antígeno viral) na saliva, independentemente da
idade e estado do paciente.',
        'UECE',
        'PATENTE',
        '2021-11-30'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Valdester Cavalcante Pinto Júnior', 'Maria Izabel Florindo Guedes', 'Luiz Francisco Wemmenson Gonçalves Moura', 'Ana Cláudia Marinho da Silva', 'Ney de Carvalho Almeida', 'Eridan Orlando Pereira Tramontina Florean', 'Daylana Régia de Sousa Dantas', 'Cícero Matheus Lima Amaral', 'Daniel Freire Lima', 'Arnaldo Solheiro Bezerra']::varchar[],
        'Fundação Universidade Estadual do Ceará e Greenbean Biotecnologia',
        'O método pode ser usado também para a verificação de um contato
anterior com o patógeno, por de detecção de anticorpos na saliva. O teste possui alta sensibilidade
e especificidade, é seguro e de baixo custo.',
        'BR 10 2021 024173 0',
        'BR 10 2021 024173 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2021 024173 0'
          AND p.nome = 'Processo de Produção de Antigenos E Anticorpos Para desenvolvimento Diagnóstico de Sars-Cov-2 Em Saliva E Outras Secreções'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [172/242] PATENTE DE INVENÇÃO (Linha 53) - BR 10 2021 020428 1 - Potenciais Biomarcadores Para Diagnóstico E Prognóstico de Transtorno 
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Potenciais Biomarcadores Para Diagnóstico E Prognóstico de Transtorno do Espectro Autístico (Tea) E Outros Transtornos do desenvolvimento Em Saliva E Outras Secreções',
        'A presente invenção situa-se no campo da Proteômica, descrevendo possíveis biomarcadores
proteicos ao diagnóstico e prognóstico do Transtorno do Espectro Autista (TEA) em amostras de
salivas de crianças por meio dos procedimentos de Proteômica Quantitativa sem rótulo. Subsidiando
uma nova perspectiva de pesquisa às proteínas super expressas e que estão associadas aos graus
severo e leve/moderado no TEA.',
        'UECE',
        'PATENTE',
        '2021-10-11'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Maria Izabel Florindo Guedes', 'Francisco Sulivan Bastos Mota', 'Benildo Sousa Cavada', 'Kyria Santiago do Nascimento', 'Vinicius José Da Silva Osterne', 'Luiz Francisco Wemmenson Gonçalves Moura', 'Messias Vital de Oliveira', 'Joana Cantidio Mota Clemente', 'Abelardo Barbosa Moreira Lima Neto']::varchar[],
        'Fundação Universidade Estadual do Ceará e Universidade Federal do Ceará',
        'Nesse sentido, a saliva pode ser usada para identificar potenciais
biomarcadores de TEA e outros transtornos do desenvolvimento. A análise pode revelar proteínas
específicas observadas em crianças ou outros com TEA leve, moderado e grave.',
        'BR 10 2021 020428 1',
        'BR 10 2021 020428 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2021 020428 1'
          AND p.nome = 'Potenciais Biomarcadores Para Diagnóstico E Prognóstico de Transtorno do Espectro Autístico (Tea) E Outros Transtornos do desenvolvimento Em Saliva E Outras Secreções'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [173/242] PATENTE DE INVENÇÃO (Linha 54) - BR 10 2021 019285 2 - Uso de Vírus Da Bronquite Infecciosa (Ibv), Vacina Para Imunização de 
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Uso de Vírus Da Bronquite Infecciosa (Ibv), Vacina Para Imunização de Mamíferos Contra Coronavírus E Método de Imunização de Mamíferos Contra Coronavírus',
        'A presente invenção se situa nos campos da biotecnologia, imunologia e do esforço mundial contra a COVID-19. Provocada por um vírus recém-descoberto da família Coronaviridae, o então denominado SARS CoV 2, causador da atual pandemia de coronavirose (COVID-19), a doença se caracteriza por uma síndrome respiratória aguda grave como principal processo patológico.',
        'UECE',
        'PATENTE',
        '2021-09-27'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Maria Izabel Florindo Guedes', 'Mauricio Fraga Van Tilburg', 'Ney de Carvalho Almeida']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Na presente invenção, o coronavírus aviário (IBV) causador da Bronquite Infecciosa das Galinhas (IBV), uma enfermidade com certo grau de semelhança com o COVID-19 e que é há muito tempo estudada, foi empregado para a preparação de vacinas para a imunização de mamíferos contra o SARS CoV 2/COVID-19, com resultados surpreendentes.',
        'BR 10 2021 019285 2',
        'BR 10 2021 019285 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2021 019285 2'
          AND p.nome = 'Uso de Vírus Da Bronquite Infecciosa (Ibv), Vacina Para Imunização de Mamíferos Contra Coronavírus E Método de Imunização de Mamíferos Contra Coronavírus'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [174/242] PATENTE DE INVENÇÃO (Linha 55) - BR 10 2021 018580 5 - Acetofenona E Chalconas Sintéticas Com Atividade Antiviral Contra Os V
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Acetofenona E Chalconas Sintéticas Com Atividade Antiviral Contra Os Vírus Da dengue E Chikungunya',
        'A presente invenção situa-se no campo da biotecnologia e virologia e consiste na utilização de
chalconas sintéticas e uma acetofenona que apresentaram atividade com potencial antiviral.
Estas substâncias com atividade antiviral foram testadas em culturas de células vero previamente
infectadas com os quatro sorotipos do vírus da dengue e Chikungunya. Estas Chalconas foram
obtidas através da síntese e condensação de Claisen-Schmidt enquanto que a Acetofenona foi
isolada a partir do Croton anisodontud Mull.Arg e são consideradas metabólitos secundários
oriundo de biossíntese de flavonóides.',
        'UECE',
        'PATENTE',
        '2021-09-17'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Silvia Sousa Aquino', 'José Ytalo Gomes da Silva', 'Maria Izabel Florindo Guedes', 'Hélcio Silva dos Santos', 'Paulo Nogueira Bandeira', 'Carlos Emídio Sampaio Nogueira', 'Alexandre Magno Rodrigues Teixeira']::varchar[],
        'Fundação Universidade Estadual do Ceará, Universidade Regional do Cariri e Universidade Estadual Vale do Acaraú',
        'Essa metodologia de aplicação da chalconas e acetofenonas
com atividade antiviral favorece a produção de novas formulações terapêuticas fitoterápica
que podem ser administrada por via oral nas seguintes apresentações: em pó, em cápsulas,
ou suspensão oral, ou ainda em aplicações tópicas em forma de creme, pomada ou spray para
profilaxia e tratamento de viroses',
        'BR 10 2021 018580 5',
        'BR 10 2021 018580 5',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2021 018580 5'
          AND p.nome = 'Acetofenona E Chalconas Sintéticas Com Atividade Antiviral Contra Os Vírus Da dengue E Chikungunya'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [175/242] PATENTE DE INVENÇÃO (Linha 56) - BR 10 2021 018060 9 - Uso de Nitroprussiato Adsorvido Em Matriz de Sílica Para Tratamento de
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Uso de Nitroprussiato Adsorvido Em Matriz de Sílica Para Tratamento de Disfunção Erétil E Uso Combinado Com Inibidores Da Fosfodiesterase',
        'A presente patente de invenção está inserida no campo da indústria farmacêutica e refere-se a
uma nova proposta de uso de nitroprussiato adsorvido em matriz de sílica para tratamento de
disfunção erétil e uso combinado com inibidores da fosfodiesterase para formulações terapêuticas
de tratamento de disfunção erétil em homens',
        'UECE',
        'PATENTE',
        '2021-09-12'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Elisane Longhinotti', 'Eduardo Henrique Silva Sousa', 'Luiz Gonzaga de França Lopes', 'Pedro Martins Da Silva Filho', 'Iury Araújo Paz', 'Nilberto Robson Falcão do Nascimento']::varchar[],
        'Fundação Universidade Estadual do Ceará e Universidade Federal do Ceará',
        'O material, MPSi-NO, mostra capacidade de entrega de óxido nítrico com atividade vasodilatadora de corpo cavernoso humano e seu uso tópico potencialmente limitaria seus efeitos colaterais sistêmicos e pode localizar ainda os efeitos de inibidores de fosfodiesterase do tipo 5 aumentando sua eficácia nos 30-40% dos pacientes que não respondem bem a este medicamento, uma vez que estes inibidores apenas inibem a degradação de GMPc pré-formado. O MPSi-NP pode ser usado para formulações terapêuticas de tratamento de disfunção erétil em homens e mulheres.',
        'BR 10 2021 018060 9',
        'BR 10 2021 018060 9',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2021 018060 9'
          AND p.nome = 'Uso de Nitroprussiato Adsorvido Em Matriz de Sílica Para Tratamento de Disfunção Erétil E Uso Combinado Com Inibidores Da Fosfodiesterase'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [176/242] PATENTE DE INVENÇÃO (Linha 57) - BR 10 2021 013335 0 - Sistema de Teste Comportamental Exploratório Automatizado Para Avaliaç
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Sistema de Teste Comportamental Exploratório Automatizado Para Avaliação Farmacológica Préclínica- Sistex',
        'Um sistema de teste comportamental exploratório, com aplicação na área de biotecnologia
animal visando a automatização de processos de avaliação experimental do comportamento in
vivo. Trata-se de um protótipo usado para avaliar modelos de animais roedores desenvolvido para
aplicação laboratorial (pesquisa). O foco de aplicação do equipamento são centros de pesquisas
com experimentação animal para realizar a coleta de dados de forma automatizada e favorável
a segurança e precisão dos dados. O modelo consiste em um sistema automatizado composto
por uma caixa e dispositivos eletrônicos, para recolher informações e monitorar comportamento
exploratório através de uma câmera com sensores de temperatura, modo noturno e diurno. O
sistema é capaz de quantificar o deslocamento do animal em quadrantes simulados artificialmente
dentro de um determinado espaço físico da caixa.',
        'UECE',
        'PATENTE',
        '2021-07-06'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Jefferson Pacheco Amaral Fortes', 'Vania Marilande Ceccato', 'Pedro Cunha Lopes', 'Raquel Martins de Freitas', 'Stela Mirla da Silva Felipe', 'Francisco Fleury Uchoa Santos Junior', 'Karla Camila Lima de Souza', 'Antonio Nadson Modesto Filho', 'Damis Iuri Garcia do Vale', 'Yure Vieira Sampaio Albuquerque']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O sistema detecta o movimento do animal e ao
final do teste fornece dados da quantidade de quadrantes explorados, número de vezes que cada
quadrante foi explorado, tempo máximo e mínimo em cada quadrante, temperatura máxima e
mínima detectável do animal. A caixa operante possui um dispositivo eletrônico controlado por
um sistema de programação em formato Python, controlado por um aplicativo de smartphone,
armazenando os dados emitidos. O produto fornece vantagens de modernização nos testes
comportamentais experimentais, elevando a precisão de dados nas capacidades exploratórias
ampliando as interpretações dos testes comportamentais para os pesquisadores.',
        'BR 10 2021 013335 0',
        'BR 10 2021 013335 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2021 013335 0'
          AND p.nome = 'Sistema de Teste Comportamental Exploratório Automatizado Para Avaliação Farmacológica Préclínica- Sistex'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [177/242] PATENTE DE INVENÇÃO (Linha 58) - BR 10 2021 006641 5 - Teste Rápido de Aglutinação Em Látex Para Diagnóstico de Rotavírus
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Teste Rápido de Aglutinação Em Látex Para Diagnóstico de Rotavírus',
        'Os testes de aglutinação em látex são empregados em laboratórios de análises clínicas e têm a
vantagem de serem executados com facilidade e rapidez na rotina da medicina humana podendo
ser utilizados como método de triagem bem como serem aplicados em estudos epidemiológicos.',
        'UECE',
        'PATENTE',
        '2021-04-07'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Sabrina Tainah da Cruz Silva Bezerra', 'Maria Izabel Florindo Guedes', 'Maria Fátima da Silva Teixeira', 'Helen Paula Silva da Costa']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Através da aglutinação de um reagente de látex sensibilizado com um anticorpo anti-rotavírus
obtido a partir de antígeno vacinal, a presente invenção disponibiliza um processo e uma
ferramenta mais simples e rápida para elaboração de teste diagnóstico para rotavirose.',
        'BR 10 2021 006641 5',
        'BR 10 2021 006641 5',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2021 006641 5'
          AND p.nome = 'Teste Rápido de Aglutinação Em Látex Para Diagnóstico de Rotavírus'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [178/242] PATENTE DE INVENÇÃO (Linha 59) - BR 10 2021 006020 4 - Composição E Formulação de Substâncias Das Partes Da Planta de Turnera
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Composição E Formulação de Substâncias Das Partes Da Planta de Turnera Subulata Sm. Com Efeito Antioxidante, Antinociceptivo, Ansiolítico, Anti-Inflamatório E Hipoglicemiante',
        'A busca por novas fórmulas com compostos bioativos capazes de apresentar atividades biológicas
para o tratamento e prevenção de doenças são fundamentais para a produção de fitoterápicos.
A invenção consiste em na elaboração de formulações líquidas (extratos e ou tinturas) ou sólidas
(sachê ou cápsula) feito a partir das flores, folhas, caules e raízes de Turnera subulata Sm., para a
prevenção e tratamento de dor, ansiedade, diabetes e inflamação. A produção das formulações
se dá por mecanismos que envolvem a coleta, lavagem, secagem, congelamento e a liofilização
das amostras, para a transformação em farelo seco e ou extratos e ou tinturas.',
        'UECE',
        'PATENTE',
        '2021-03-29'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Emanuela de Lima Rebouças', 'Eridan Orlando Pereira Tramontina Florean', 'Maria Izabel Florindo Guedes', 'Marnielle Coutinho Rodrigues', 'Antônio Wlisses Da Silva']::varchar[],
        'Fundação Universidade Estadual do Ceará e Greenbean Biotecnologia',
        'O consumo deve
ser realizado pelos indivíduos saudáveis ou não, associadas ou não com os preparos alimentícios.
A composição das flores e folhas apresentam potencial antinociceptivos, hipoglicemiante e
anti-inflamatório, enquanto o caule, folhas, raiz possuem efeitos na ansiedade aguda e cônica. A
quantidade terapêutica mínima indicada é de 1 mg/mL do sachê para as partes das plantas',
        'BR 10 2021 006020 4',
        'BR 10 2021 006020 4',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2021 006020 4'
          AND p.nome = 'Composição E Formulação de Substâncias Das Partes Da Planta de Turnera Subulata Sm. Com Efeito Antioxidante, Antinociceptivo, Ansiolítico, Anti-Inflamatório E Hipoglicemiante'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [179/242] PATENTE DE INVENÇÃO (Linha 60) - BR 10 2021 006097 2 - Padronização de Metodologia Diagnóstica de Baixo Custo Utilizando Anti
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Padronização de Metodologia Diagnóstica de Baixo Custo Utilizando Anticorpos Específicos Contra O Sars-Cov-2 Em Saliva',
        'A presente invenção se situa no campo da imunologia e virologia e descreve um processo de
produção de anticorpos para o vírus SARS-Cov-2 inativado, padronização da técnica sorológica
de baixo custo para o diagnóstico da COVID-19, utilizando o método de dot blot, para detectar
a presença do antígeno viral na saliva do paciente. Essa nova metodologia de uso de anticorpos
específicos para as proteínas totais do vírus, associados à técnica de dot blot e/ou outras
técnicas imunológicas, apresenta grande vantagem em relação aos métodos que detecta ácidos
nucleicos como o RT-PCR, ou detecção de anticorpos utilizando proteínas recombinantes, uma
vez que a invenção aqui apresentada detecta a presença do vírus (antígeno viral) na saliva,
independentemente da idade e estado do paciente',
        'UECE',
        'PATENTE',
        '2021-03-29'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Valdester Cavalcante Pinto Júnior', 'Maria Izabel Florindo Guedes', 'Luiz Francisco Wemmenson Gonçalves Moura', 'Ana Cláudia Marinho da Silva', 'Daylana Régia de Sousa Dantas', 'Ney de Carvalho Almeida', 'Cícero Matheus Lima Amaral', 'Daniel Freire Lima']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O método pode ser usado também para
a verificação de um contato anterior com o patógeno, pela detecção de anticorpos na saliva. O
teste possui alta sensibilidade e especificidade, é seguro e de baixo custo.',
        'BR 10 2021 006097 2',
        'BR 10 2021 006097 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2021 006097 2'
          AND p.nome = 'Padronização de Metodologia Diagnóstica de Baixo Custo Utilizando Anticorpos Específicos Contra O Sars-Cov-2 Em Saliva'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [180/242] PATENTE DE INVENÇÃO (Linha 61) - BR 10 2021 002163 2 - Microcápsulas Com Óleos Essenciais de Cymbopogon Citratus (D.C.) Stapf
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Microcápsulas Com Óleos Essenciais de Cymbopogon Citratus (D.C.) Stapf E Syzygium Aromaticum Merr (L.) & L. M. Perry, Para Uso Em Formulações Contra dermatofitoses Ocasionadas Por Trichophyton Rubrum',
        'A presente invenção trata da produção de microcápsulas com óleos essenciais de Cymbopogon
citratus (D.C.) Stapf e Syzygium aromaticum Merr (L.) & L. M. Perry, para utilização em formulações
orais e tópicas contra dermatofitoses ocasionadas por T.rubrum. As microcápsulas são compostas
por matriz polimérica e óleo essencial na proporção 2:1 e 3:1, as soluções iniciais para preparo das
microcápsulas são produzidas com homogeneização em ultra turrax, posteriormente, submetidas
a técnica de Spray drying. As microcápsulas produzidas proporcionaram boa estabilidade térmica
aos óleos essenciais, homogeneidade, morfologia regular esférica de aspecto rugoso, capaz de
propiciar proteção aos óleos essenciais, além de apresentarem significativa ação contra T.rubrum
com concentrações inibitórias mínimas que variaram de 0,001-0,156 mg/mL',
        'UECE',
        'PATENTE',
        '2021-02-04'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Selene Maia de Morais', 'Silvana Silveira de Farias', 'Raquel Oliveira dos Santos Fontenelle', 'Arcelina Pacheco Cunha', 'Nágila Maria Pontes Silva Ricardo']::varchar[],
        'Fundação Universidade Estadual do Ceará, Universidade Federal do Ceará e Universidade Estadual Vale do Acaraú',
        'a
presente invenção representa uma alternativa promissora para uso oral e tópico em infecções
fúngicas causadas por T.rubrum.',
        'BR 10 2021 002163 2',
        'BR 10 2021 002163 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2021 002163 2'
          AND p.nome = 'Microcápsulas Com Óleos Essenciais de Cymbopogon Citratus (D.C.) Stapf E Syzygium Aromaticum Merr (L.) & L. M. Perry, Para Uso Em Formulações Contra dermatofitoses Ocasionadas Por Trichophyton Rubrum'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [181/242] PATENTE DE INVENÇÃO (Linha 62) - BR 10 2020 022628 2 - Preparação de Azeite de Oliva E Outros Alimentos Adicionados de Formul
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Preparação de Azeite de Oliva E Outros Alimentos Adicionados de Formulações Compostas de Substâncias Extraídas Da Carnaúba',
        'Este estudo teve como objetivo analisar o potencial hipoglicemiante, hipolipidêmico, tecnológico
e sensorial de azeite de oliva agregado ao diéster doácido 4-metoxicinâmico (PCO-C), obtido a
partir do pó cerífero da carnaúba (Copernicia prunifera) (família Arecaceae).',
        'UECE',
        'PATENTE',
        '2020-11-06'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Iramaia Bruno Silva', 'Maria Izabel Florindo Guedes', 'José Ytalo Gomes da Silva', 'Claisa Andrea Freitas Rabelo', 'Icaro Gusmão Pinto Vieira', 'Francisca Noelia Pereira Mendes']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O diferencial tecnológico aqui reside na combinação específica de componentes derivados de fontes naturais, visando benefícios para a saúde, e na abordagem holística que considera aspectos nutricionais, tecnológicos e sensoriais.',
        'BR 10 2020 022628 2',
        'BR 10 2020 022628 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2020 022628 2'
          AND p.nome = 'Preparação de Azeite de Oliva E Outros Alimentos Adicionados de Formulações Compostas de Substâncias Extraídas Da Carnaúba'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [182/242] PATENTE DE INVENÇÃO (Linha 63) - BR 10 2020 021333 4 - Produtos Obtidos Das Folhas E do Caule Das Espécies Astronium Fraxinif
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Produtos Obtidos Das Folhas E do Caule Das Espécies Astronium Fraxinifolium Schott (Gonçalo Alves) E Myracrodruon Urundeuva Allemão (Aroeira do Sertão) Com Propriedades Contra O Vírus Zika',
        'Esta invenção trata da utilização do extrato etanólico das folhas e do caule das espécies
Astronium fraxinifolium Schott (Gonçalo Alves) e Myracrodruon urundeuva Allemão (Aroeira do
Sertão) caracterizados por cromatografia líquida de alta eficiência (CLAE) contra o vírus Zika.',
        'UECE',
        'PATENTE',
        '2020-10-19'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Selene Maia de Morais', 'Maria Izabel Florindo Guedes', 'Icaro Gusmão Pinto Vieira', 'Ana Livya Moreira Rodrigues']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'As
formulações com base nesses extratos, caracterizados com a presença dos compostos químicos
ácido gálico, ácido clorogênico, rutina, ácido elágico, isoquercitrina, canferol-3-O-rutinosideo,
quercetina e amentoflavona, promoverão uma inibição viral, interrompendo o ciclo de vida do
vírus.',
        'BR 10 2020 021333 4',
        'BR 10 2020 021333 4',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2020 021333 4'
          AND p.nome = 'Produtos Obtidos Das Folhas E do Caule Das Espécies Astronium Fraxinifolium Schott (Gonçalo Alves) E Myracrodruon Urundeuva Allemão (Aroeira do Sertão) Com Propriedades Contra O Vírus Zika'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [183/242] PATENTE DE INVENÇÃO (Linha 64) - BR 10 2020 020911 6 - Processo de Produção E Purificação Da Lasparaginase, Em Sistema Vegeta
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Produção E Purificação Da Lasparaginase, Em Sistema Vegetal E Bacteriano, E O Seu Uso Terapêutico Em Formulações Para O Tratamento de Leucemias E Outros Tipos de Câncer',
        'A presente invenção pertence ao campo da biotecnologia e consiste em um polipeptídio
recombinante, expresso em plataforma vegetal e bacteriana, com a finalidade de uso médico e
veterinário, usado em procedimentos terapêuticos antineoplásicos.',
        'UECE',
        'PATENTE',
        '2020-10-13'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Davi Almeida Freire', 'Maria Izabel Florindo Guedes', 'Eridan Orlando Pereira Tramontina Florean']::varchar[],
        'Fundação Universidade Estadual do Ceará e Greenbean Biotecnologia',
        'O polipeptídio consiste em
uma L-asparaginase tipo II oriunda da bactéria Proteus vulgaris, tendo seu gene modificado para
a expressão nas respectivas plataformas. Além do método de expressão permitir mais solubilidade
ao polipeptídio, o mesmo ainda pode conter modificações como glicanos e tagsfusionadas a sua
estrutura, o que contribui para sua imunogenicidade, estabilidade e purificação',
        'BR 10 2020 020911 6',
        'BR 10 2020 020911 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2020 020911 6'
          AND p.nome = 'Processo de Produção E Purificação Da Lasparaginase, Em Sistema Vegetal E Bacteriano, E O Seu Uso Terapêutico Em Formulações Para O Tratamento de Leucemias E Outros Tipos de Câncer'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [184/242] PATENTE DE INVENÇÃO (Linha 65) - BR 10 2020 019867 0 - Uso Da Vacina de Coronavírus Aviário (Ibv) Como Modelo de Imunização E
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Uso Da Vacina de Coronavírus Aviário (Ibv) Como Modelo de Imunização Em Mamíferos Contra Sars-Cov 2',
        'A presente invenção refere-se à possibilidade de segundo uso do IBV, em qualquer estado (morto,
atenuado, com apenas suas estruturas moleculares isoladas ou associadas), na imunização
(vacina) de mamíferos, inclusive humanos, contra o SARS-CoV 2,seja ela humoral ou celular.',
        'UECE',
        'PATENTE',
        '2020-09-28'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Maria Izabel Florindo Guedes', 'Mauricio Fraga Van Tilburg', 'Ney de Carvalho Almeida']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Os
estudos em camundongos imunizados com o IBV mostraram satisfatória atividade da ação
neutralizante/inibitória dos anticorpos por eles produzidos contra o vírus SARSCoV 2 em cultivo
de células, denotando que anticorpos anti-IBV funcionam também na proteção contra o COVID19,podendo-se usar vacinas contra o IBV das aves também como vacinas contra a COVID-19',
        'BR 10 2020 019867 0',
        'BR 10 2020 019867 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2020 019867 0'
          AND p.nome = 'Uso Da Vacina de Coronavírus Aviário (Ibv) Como Modelo de Imunização Em Mamíferos Contra Sars-Cov 2'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [185/242] PATENTE DE INVENÇÃO (Linha 66) - BR 10 2020 016212 8 - Produtos Obtidos Da Annona Mucosa [Jacq.] (Biribá) Como Agentes Larvic
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Produtos Obtidos Da Annona Mucosa [Jacq.] (Biribá) Como Agentes Larvicidas Contra Aedes Aegypti E Aedes Albopictus',
        'A presente invenção trata da utilização do extrato etanólico, frações ricas em acetogeninase
acetogeninas isoladas do biribá (Annona mucosa) no controle de larvas de Aedes aegyptie Aedes
albopictus, mosquitos vetores de arboviroses importantes como dengue, Zika e Chikungunya.',
        'UECE',
        'PATENTE',
        '2020-08-10'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Alice Araujo Da Silva', 'Alzeir Machado Rodrigues', 'Selene Maia de Morais']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A formulação larvicida contém o extrato de Annona mucosa, a fração rica em acetogeninas e as
acetogeninas isoladas, rolliniastatina-1 e rollinicina, obtidas a partir de sementes do biribá cuja
ação larvicida já foi verificada tanto em Aedes aegypti quanto em Aedes albopictus. dentre os
mecanismos de ação investigados para o efeito larvicida, destacam-se: a inibição de enzimas dos
mosquitos e alterações histopatológicas no intestino médio.',
        'BR 10 2020 016212 8',
        'BR 10 2020 016212 8',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2020 016212 8'
          AND p.nome = 'Produtos Obtidos Da Annona Mucosa [Jacq.] (Biribá) Como Agentes Larvicidas Contra Aedes Aegypti E Aedes Albopictus'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [186/242] PATENTE DE INVENÇÃO (Linha 67) - BR 10 2020 014106 6 - Complexo Metálico do Ácido Anacárdico Com Ação Antiproliferativa Em Cé
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Complexo Metálico do Ácido Anacárdico Com Ação Antiproliferativa Em Células Tumorais',
        'A presente invenção trata da síntese de um complexo com ação citotóxica em células tumorais
formado entre a prata(Ag+) e a mistura dos ácidos anacárdicos (AAs) extraídos do líquido da
casca da castanha de caju (LCC), de Anacardium occidentale.',
        'UECE',
        'PATENTE',
        '2020-07-09'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Alexandre de Sousa Barros', 'Selene Maia de Morais']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O complexo é sintetizado a partir
da reação na proporção molar 1:2 (metal:ligante) em meio alcalino do nitrato de prata(AgNO3)
com o ligante, a mistura dos ácidos anacárdicos, com pureza relativa de94,61% e proporção entre
os três ácidos anacárdicos trieno, dieno e monoeno de 2,9:1,0:1,1, respectivamente.',
        'BR 10 2020 014106 6',
        'BR 10 2020 014106 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2020 014106 6'
          AND p.nome = 'Complexo Metálico do Ácido Anacárdico Com Ação Antiproliferativa Em Células Tumorais'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [187/242] PATENTE DE INVENÇÃO (Linha 68) - BR 10 2020 005050 8 - Composição E Formulação Nutracêutica Para O Tratamento de Dislipidemia
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Composição E Formulação Nutracêutica Para O Tratamento de Dislipidemia, Ansiedade E Inibição de Acetilcolinesterase A Partir Da Farinha de Xanthosoma Sagittifolium (L.) Schott (Taioba)',
        'A presente invenção é uma farinha alimentar que resulta da folha de Xanthosoma sagittifolium
(L.) Schott (Taioba) que pode ser misturada com a farinha do caule da taioba ou de outras
farinhas de plantas. A produção da farinha se dá por mecanismos de transformação que contém
processos de cozimento, trituração, congelamento e liofilização, transformando-a em farelo
seco. Essa invenção pode ser consumida por indivíduos saudáveis, ou não, de forma isolada ou
adicionada em qualquer preparação alimentícia.',
        'UECE',
        'PATENTE',
        '2020-03-13'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Carla Laíne Silva Lima', 'Maria Izabel Florindo Guedes', 'Eridan Orlando Pereira Tramontina Florean']::varchar[],
        'Fundação Universidade Estadual do Ceará e Greenbean Biotecnologia',
        'A composição possui potencial para controle de
doenças metabólicas e do sistema nervoso como: dislipidemia, ansiedade e inibição da enzima
acetilcolinesterase, compreendendo uma quantidade terapêutica mínima de 0,01mg/ml de
farinha da planta.',
        'BR 10 2020 005050 8',
        'BR 10 2020 005050 8',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2020 005050 8'
          AND p.nome = 'Composição E Formulação Nutracêutica Para O Tratamento de Dislipidemia, Ansiedade E Inibição de Acetilcolinesterase A Partir Da Farinha de Xanthosoma Sagittifolium (L.) Schott (Taioba)'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [188/242] PATENTE DE INVENÇÃO (Linha 69) - BR 10 2020 004928 3 - Construto Sintético Ns2b, Processo de Produção do Mesmo E de Seus deri
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Construto Sintético Ns2b, Processo de Produção do Mesmo E de Seus derivados Imunobiológicos Para A Imunoprofilaxia E O Diagnóstico de Flavivirose',
        'A presente invenção descreve a construção e otimização de um gene sintético da proteína NS2B
de Zika virus, assim como as etapas para sua expressão e purificação a partir de sistema vegetal.',
        'UECE',
        'PATENTE',
        '2020-03-12'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Mario Alberto Maestre Herazo', 'Eridan Orlando Pereira Tramontina Florean', 'Maria Izabel Florindo Guedes', 'Bruno Bezerra da Silva']::varchar[],
        'Fundação Universidade Estadual do Ceará e Greenbean Biotecnologia',
        'A invenção descreve ainda a utilização dessa proteína como substrato para a produção de
derivados imunobiológicos a serem empregados, isolados ou associados à proteína em questão,
em imunoensaios para fins de diagnóstico.',
        'BR 10 2020 004928 3',
        'BR 10 2020 004928 3',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2020 004928 3'
          AND p.nome = 'Construto Sintético Ns2b, Processo de Produção do Mesmo E de Seus derivados Imunobiológicos Para A Imunoprofilaxia E O Diagnóstico de Flavivirose'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [189/242] PATENTE DE INVENÇÃO (Linha 70) - BR 10 2020 004834 1 - Uso de Pitaya (Hylocereus Polyrhizus (Weber) Britton & Rose) Na Preven
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Uso de Pitaya (Hylocereus Polyrhizus (Weber) Britton & Rose) Na Prevenção E Tratamento Ansiedade',
        'A presente invenção é um sachê que resulta da polpa e da casca de (Hylocereus polyrhizus) (Weber) Britton & Rose (pitaia) que pode ser misturada com as outras preparações alimentícias. A produção do sachê se dá por mecanismos que envolve o processamento para separação de polpa e casca, o congelamento e a liofilização, transformando-a em farelo seco.',
        'UECE',
        'PATENTE',
        '2020-03-11'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Eridan Orlando Pereira Tramontina Florean', 'Rafaela Cajado Magalhães', 'Maria Izabel Florindo Guedes', 'Sandra Machado Lira', 'Marcelo Oliveira Holanda']::varchar[],
        'Fundação Universidade Estadual do Ceará e Greenbean Biotecnologia',
        'Essa invenção pode ser consumida por indivíduos saudáveis, ou não, de forma isolada ou adicionada em qualquer preparação alimentícia. A composição possui potencial para controle da ansiedade, compreendendo uma quantidade terapêutica mínima de 0,1 mg/ml do sachê da fruta.',
        'BR 10 2020 004834 1',
        'BR 10 2020 004834 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2020 004834 1'
          AND p.nome = 'Uso de Pitaya (Hylocereus Polyrhizus (Weber) Britton & Rose) Na Prevenção E Tratamento Ansiedade'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [190/242] PATENTE DE INVENÇÃO (Linha 71) - BR 10 2019 025857 8 - Método E Dispositivo de Avaliação de Risco de Lesão Muscular
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Método E Dispositivo de Avaliação de Risco de Lesão Muscular',
        'A presente invenção se situa no campo da ciência médica do diagnóstico e descreve um método de medição com finalidades de diagnóstico de risco de lesão muscular, através da avaliação de parâmetros bioelétricos de regiões corporais para detecção da saúde celular do tecido muscular.',
        'UECE',
        'PATENTE',
        '2019-12-06'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Alex Soares Marreiros Ferraz', 'Vânia Marilande Ceccatto', 'Renê de Caldas Honorato']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O processo ainda envolve o processamento dos dados bioelétricos em conjunto com dados antropométricos, psicométricos, funcionais e bioquímicos, para maior acurácia da mensuração do risco de lesão muscular.',
        'BR 10 2019 025857 8',
        'BR 10 2019 025857 8',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2019 025857 8'
          AND p.nome = 'Método E Dispositivo de Avaliação de Risco de Lesão Muscular'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [191/242] PATENTE DE INVENÇÃO (Linha 72) - BR 10 2019 007713 1 - Uso de Solução À Base de Água de Coco desidratada Para A Preservação d
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Uso de Solução À Base de Água de Coco desidratada Para A Preservação de Rins de Mamíferos',
        'A presente invenção refere-se ao uso de solução à base de água de coco desidratada com aplicação na área de biotecnologia em saúde visando a promoção dos processos de preservação de rins de mamíferos.',
        'UECE',
        'PATENTE',
        '2019-04-16'::date,
        'Data de Concessão: 2025-06-24',
        NULL, NULL, NULL,
        'Concedido',
        ARRAY['Rômulo Augusto da Silveira', 'Rômulo da Costa Farias', 'Ivelise Regina Canito Brasil', 'Cristiane Clemente de Mello Salgueiro', 'José Ferreira Nunes', 'Raquel Lima Sampaio', 'Lucas Medeiros Lopes', 'Bianca Rohsner Bezerra', 'Samuel Roque Alves']::varchar[],
        'Fundação Universidade Estadual do Ceará e ACP Biotecnologia',
        'Os processos de preservação empregados no invento são capazes de manter a viabilidade dos rins por até 48 horas.',
        'BR 10 2019 007713 1',
        'BR 10 2019 007713 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2019 007713 1'
          AND p.nome = 'Uso de Solução À Base de Água de Coco desidratada Para A Preservação de Rins de Mamíferos'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [192/242] PATENTE DE INVENÇÃO (Linha 73) - BR 10 2019 002844 0 - Órtese Ortopédica Para Animais Diabéticos
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Órtese Ortopédica Para Animais Diabéticos',
        'Trata-se de um modelo de órtese ortopédica para um modelo de roedores diabéticos submetidos
ao treinamento de corrida desenvolvida para aplicação laboratorial e confeccionada com quatro
tipos diferentes de materiais comerciais: podadur, borracha de silicone, Etileno Acetato de Vinila
(EVA) e o látex pré-vulcanizado (Hevea brasiliensis). As referidas órteses apresentam as seguintes
dimensões (3,5 x 1,0 cm) com textura homogênea, superfície plana e lisa, resistente à deformação
e flexível ao manuseio e movimentação com formato similar a pata do animal abrangendo o
calcâneo até as falanges distais incluindo o formato do arco longitudinal.',
        'UECE',
        'PATENTE',
        '2019-02-12'::date,
        'Data de Concessão: 2025-04-01',
        NULL, NULL, NULL,
        'Concedido',
        ARRAY['Karla Camila Lima de Souza', 'Cassiano Oliveira Moreira', 'Nathália Maria Rodrigues de Andrade', 'Jefferson Pacheco Amaral Fortes', 'Pedro Cunha Lopes', 'José William Girão Dias', 'Francisco Fleury Uchoa Santos Júnior', 'Vânia Marilande Ceccatto', 'Antônio Nadson Modesto Filho', 'Yara Carliane de Abreu Mesquita', 'Carla Andressa Andrade dos Santos', 'Jonathan Elias Rodrigues Martins']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'As principais vantagens
da órtese inclui o amortecimento durante o impacto da pisada, distribuir melhor as pressões
impostas pelas patas dos animais, absorver a umidade, serem flexíveis e duráveis proporcionando
maior conforto e evitando possíveis ulcerações oriundas de complicações do diabetes.',
        'BR 10 2019 002844 0',
        'BR 10 2019 002844 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2019 002844 0'
          AND p.nome = 'Órtese Ortopédica Para Animais Diabéticos'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [193/242] PATENTE DE INVENÇÃO (Linha 74) - BR 10 2018 075807 1 - Uso de Extrato de Plantas do Gênero Croton, Uso de Estragol, Uso de An
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Uso de Extrato de Plantas do Gênero Croton, Uso de Estragol, Uso de Anetol E Método de Tratamento de Neuropatias',
        'A presente invenção descreve uso o extrato de plantas do gênero Croton e seus componentes,
estragol e anetol, para tratamento de neuropatias, bem como métodos de tratamento de
neuropatias',
        'UECE',
        'PATENTE',
        '2018-12-12'::date,
        'Data de Concessão: 2024-08-06',
        NULL, NULL, NULL,
        'Concedido',
        ARRAY['Francisco Walber Ferreira da Silva', 'Vânia Marilande Ceccatto', 'Aline Alice Cavalcante de Albuquerque', 'Morgana Barroso Oquendo', 'Flávio Henrique Pequeno de Macedo', 'Kerly Shamyra da Silva Alves', 'José Henrique Leal Cardoso', 'Andrelina Noronha Coelho de Souza']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A presente invenção também compreende o uso do extrato de plantas do gênero
Croton no preparo de composições para tratamento de neuropatias em geral e neuropatias
diabéticas de maneira independente da redução da glicemia',
        'BR 10 2018 075807 1',
        'BR 10 2018 075807 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2018 075807 1'
          AND p.nome = 'Uso de Extrato de Plantas do Gênero Croton, Uso de Estragol, Uso de Anetol E Método de Tratamento de Neuropatias'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [194/242] PATENTE DE INVENÇÃO (Linha 75) - BR 10 2018 072793 1 - Fungicida Natural Para Uso Farmacológico E Fitossanitário
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Fungicida Natural Para Uso Farmacológico E Fitossanitário',
        'Fungicida natural para uso farmacológico e fitossanitário A presente solicitação de concessão de
patente reivindica a invenção de emulsões, compostas por extratos obtido a partir de órgãos da
espécie vegetal A. indica A. Juss, preferencialmente da raiz, extraídos com solventes indicados
e diluídos em meios e proporções adequados. Também reivindica a invenção de formulações,
obtidas a partir de emulsões de óleos vegetais ou óleos essenciais de Eucalipto staigeriana e
Syzygium aromaticum L. e de extratos de órgãos da espécie vegetal A. indica, preferencialmente
da raiz, extraídos com solvente indicados e diluídos em meios e proporções adequados.',
        'UECE',
        'PATENTE',
        '2018-11-06'::date,
        'Data de Concessão: 2023-09-26',
        NULL, NULL, NULL,
        'Concedido',
        ARRAY['Carlucio Roberto Alves', 'Katiany do Vale Abreu', 'Ana Lúcia Eufrázio Romão']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'É
também alvo de reivindicação os usos das formulações e emulsões descritas como defensivo
natural, no controle fitossanitário e/ou fármaco a serem aplicados na incidência e no controle
de patógenos responsáveis por doenças em humanos, preferencialmente espécies do gênero
Candida e Trichophyton rubrum, e no combate a fitopatógenos, preferencialmente L. theobromae.
Reivindica-se também proteção às aplicações das emulsões e formulações em suas amplas faixas
de diluição, sem que estas percam o potencial de atividade antimicrobiológica, tendo em vista as
características quantitativas e qualitativas de maneira a atender os níveis de produção desejados.',
        'BR 10 2018 072793 1',
        'BR 10 2018 072793 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2018 072793 1'
          AND p.nome = 'Fungicida Natural Para Uso Farmacológico E Fitossanitário'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [195/242] PATENTE DE INVENÇÃO (Linha 76) - BR 10 2018 017162 3 - Proteína Recombinante, Processo de Produção Da Mesma, Uso Da Proteína 
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Proteína Recombinante, Processo de Produção Da Mesma, Uso Da Proteína Na Preparação de Um Imunógeno Contra A Leishmaniose Visceral Canina Ou Humana E Uso Da Proteína Em Teste de detecção Ou Kit de detecção Para detectar Leishmaniose Visceral Assintomática Ou Sub-Clínica Em Uma Amostra Biológica',
        'A presente invenção descreve Proteína recombinante e o processo utilizado para a expressão de
proteínas recombinantes de Leishmania em sistema eucarioto, utilizando vetores de expressão
fusionados ou não a tags de purificação e ou solubilidade, como exemplo, hidrofobinas e elastinas,.',
        'UECE',
        'PATENTE',
        '2018-08-22'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Maria Izabel Florindo Guedes', 'Eridan Orlando Pereira Tramontina Florian', 'Eduarda Nattaly Ferreira Nobre Santos', 'Bruno Bezerra da Silva', 'Selene Maia de Morais', 'Lucelina da Silva Araújo']::varchar[],
        'Fundação Universidade Estadual do Ceará e Greenbean Biotecnologia',
        'Direcionada para a produção de uma vacina terapêutica, a tecnologia permite o drrecionamento dos antígenos expressos para a produção de testes
ou kits de diagnóstico para Leishmaniose visceral. A presente invenção se situa no campo da
medicina veterinária, medicina, saúde pública e sanitária, farmácia, biotecnologia, bioengenharia
e biomedicina.',
        'BR 10 2018 017162 3',
        'BR 10 2018 017162 3',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2018 017162 3'
          AND p.nome = 'Proteína Recombinante, Processo de Produção Da Mesma, Uso Da Proteína Na Preparação de Um Imunógeno Contra A Leishmaniose Visceral Canina Ou Humana E Uso Da Proteína Em Teste de detecção Ou Kit de detecção Para detectar Leishmaniose Visceral Assintomática Ou Sub-Clínica Em Uma Amostra Biológica'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [196/242] PATENTE DE INVENÇÃO (Linha 77) - BR 10 2018 015260 2 - Composição E Formulação Farmacêutica Para O Tratamento Da Diabetes E d
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Composição E Formulação Farmacêutica Para O Tratamento Da Diabetes E doenças Metabólicas A Partir de Extratos de Cnidoscolus Quercipholius Pohl (Faveleira)',
        'A presente invenção refere-se à aplicação e elaboração de extratos aquosos, alcóolicos, etanólicos ou metanólicos, percolações ou decoctos, além de sumos das folhas e/ou partes da planta tais como: caule, raiz e casca da raiz da planta Cnidoscolus Quercipholius pohl conhecida
popularmente como Faveleira. Os extratos da planta podem ser de cada parte da planta isolada ou utilizada uma mistura dos extratos entre si utilizados como princípios ativos para uso em composições farmacêuticas por vias adequadas, em particular nas apresentação para uso oral
em forma de pó, tintura, alcoolatura, suspensão, emulsão, cápsula, drágea e similares, utilizada para profilaxia e tratamento da diabetes mellitus insulino-dependente ou não.',
        'UECE',
        'PATENTE',
        '2018-07-26'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Sandra Machado Lira', 'Fernando César Rodrigues Brito', 'Maria Izabel Florindo Guedes', 'Luiz Francisco Wemmenson Gonçalves Moura']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Esta invenção
estende-se às composições farmacêuticas por via oral, ligadas à profilaxia e ao tratamento da
diabetes, compreendendo formulações com frações de extratos e/ou partes dos seus constituintes
extraídos da planta Cnidoscolus Quercipholius poh usados como fitoterápicos, isoladamente ou
separados entre si.',
        'BR 10 2018 015260 2',
        'BR 10 2018 015260 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2018 015260 2'
          AND p.nome = 'Composição E Formulação Farmacêutica Para O Tratamento Da Diabetes E doenças Metabólicas A Partir de Extratos de Cnidoscolus Quercipholius Pohl (Faveleira)'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [197/242] PATENTE DE INVENÇÃO (Linha 78) - BR 11 2020 012702 7 - Kit E Processo Para detecção de Imunoglobulinas E E Imunoglobulinas G1
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Kit E Processo Para detecção de Imunoglobulinas E E Imunoglobulinas G1',
        'A presente invenção tem por objetivo o diagnóstico de reações alérgicas por meio detecção de Imunoglobulinas IgE e IgG1 específicas para alimentos in natura, alimentos industrializados, aditivos alimentares e medicamentos.',
        'UECE',
        'PATENTE',
        '2018-06-29'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Marília Porto Oliveira Nunes', 'Maria Izabel Florindo Guedes', 'Eridan Orlando Pereira Tramontina']::varchar[],
        'Fundação Universidade Estadual do Ceará e Greenbean Biotecnologia',
        'O teste é específico, não invasivo, fidedigno em seus resultados, de rápido resultado, o qual em um único teste podem ser testados vários alérgenos, além de ser de fácil acesso e baixo custo, não necessitando de jejum e podendo ser aplicado em pessoas de qualquer idade. A presente invenção se situa no campo da medicina e farmácia, enfermagem, nutrição, biomedicina e bioengenharia, mais especificamente, a análise de material biológico.',
        'BR 11 2020 012702 7',
        'BR 11 2020 012702 7',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 11 2020 012702 7'
          AND p.nome = 'Kit E Processo Para detecção de Imunoglobulinas E E Imunoglobulinas G1'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [198/242] PATENTE DE INVENÇÃO (Linha 79) - BR 10 2018 011834 0 - Polipeptídeo Flaviviral Com Finalidade Vacinal E Diagnostica Produzido
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Polipeptídeo Flaviviral Com Finalidade Vacinal E Diagnostica Produzido Em Planta',
        'A presente invenção descreve a construção e otimização de genes sintéticos de um polipeptídio
quimérico contendo o domínio III da proteína do envelope dos quatro sorotipos do vírus dengue
deNV1, deNV2, deNV3 e deNV4, sua clonagem e expressão em planta.',
        'UECE',
        'PATENTE',
        '2018-06-12'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Maria Izabel Florindo Guedes', 'Eridan Orlando Pereira Tramontina Florean', 'Lívia Érika Carlos Marques', 'Bruno Bezerra da Silva', 'Danielle Ferreira de Oliveira']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A utilização de diferentes
estratégias para obtenção de altos níveis de um novo polipeptídeos quimérico baseado na
proteína do envelope do vírus dengue em planta para sua utilização na formulação de uma
vacina tetravalente de subunidade, bem como em imunoensaios que vão desde a sua utilização
até mesmo o uso de anticorpos produzidos através destes polipeptídeos em aplicações de
diagnóstico.',
        'BR 10 2018 011834 0',
        'BR 10 2018 011834 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2018 011834 0'
          AND p.nome = 'Polipeptídeo Flaviviral Com Finalidade Vacinal E Diagnostica Produzido Em Planta'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [199/242] PATENTE DE INVENÇÃO (Linha 80) - BR 10 2018 011865 0 - Creme Removedor de Pigmentos Artificiais Da Pele A Base de Ácido Anacá
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Creme Removedor de Pigmentos Artificiais Da Pele A Base de Ácido Anacárdico',
        'A presente invenção relata o desenvolvimento de creme removedor de manchas senis e
pigmentos artificiais da pele a base de ácido anacárdico. Para tanto o ácido anacárdico foi extraído
do liquido da casca da castanha de caju, sendo em seguida isolado dos demais constituintes e
analisado por cromatografia liquida de alta eficiência para avaliação do grau de pureza e eficácia
do processo de isolamento. Um creme contendo o ácido anacárdico na proporção de 1 a 10%
foi preparado utilizando uma base cosmética padrão. Cobaias foram submetidas a realização de
pigmentação na parte dorsal para realização dos testes de remoção destes pigmentos.',
        'UECE',
        'PATENTE',
        '2018-06-12'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Maria Izabel Florindo Guedes', 'Icaro Gusmão Pinto Vieira', 'Selene Maia de Morais', 'João Campos Paiva Filho']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O processo de pigmentação requereu intervalo de descanso para cicatrização e fixação do pigmento na pele
do animal. Após o período de cicatrização da pigmentação, período necessário pata fixação do
pigmento e com a tatuagem estabelecida, o creme desenvolvido foi então aplicado para o teste de
despigmentação, no qual pode-se perceber através de análise virtual uma diferença significativa
na tonalidade inicial e final do pigmento na pele da cobaia.',
        'BR 10 2018 011865 0',
        'BR 10 2018 011865 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2018 011865 0'
          AND p.nome = 'Creme Removedor de Pigmentos Artificiais Da Pele A Base de Ácido Anacárdico'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [200/242] PATENTE DE INVENÇÃO (Linha 81) - BR 10 2018 009796 2 - desenvolvimento de Produtos Fitoterápicos Adjuvantes No Tratamento Da 
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'desenvolvimento de Produtos Fitoterápicos Adjuvantes No Tratamento Da Leishmaniose Visceral Canina',
        'A presente invenção usa um extrato das folhas de Annona muricata contendo uma mistura
padronizada de acetogeninas, incluindo a annonacina como componente principal e os
flavonoides rutina, Isoquercitrina e quercetina, obtidos a partir da favas de Dimorphandra
gardneriana, na elaboração de um fitoterápico liquido que apresentou atividade antileishmanial
contra formas promastigotas de L. amazonensis. Utiliza ainda o extrato bruto cristalizado
contendo os flavonoides rutina e isoquercitrina, obtidos das favas de Dimorphandra gardneriana
na elaboração de um fitoterápico em capsulas que tambem apresentou atividade antileishmanial
contra formas promastigotas de L. amazonensis.',
        'UECE',
        'PATENTE',
        '2018-05-15'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Maria Izabel Florindo Guedes', 'José Claudio Carneiro de Freitas', 'Icaro Gusmão Pinto Vieira', 'Selene Maia de Morais', 'Francisca Noelia Pereira Mendes']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A combinação do uso do fitoterápico liquido e
as cápsulas (fitoterápico em cápsulas) com o quimioterápico a base de miltefosina apresentou
resultados satisfatórios, quando avaliados os marcadores hepáticos, renais e cardíacos, além de
uma maior redução da carga parasitária, em menor espaço de tempo. O uso do fitoterápico e
as cápsulas isoladamente, em cães naturalmente infectados por Leishmania infantum, também
apresentou uma atividade leishmanicida satisfatória, sem efeitos colaterais indesejáveis.',
        'BR 10 2018 009796 2',
        'BR 10 2018 009796 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2018 009796 2'
          AND p.nome = 'desenvolvimento de Produtos Fitoterápicos Adjuvantes No Tratamento Da Leishmaniose Visceral Canina'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [201/242] PATENTE DE INVENÇÃO (Linha 82) - BR 10 2018 005850 9 - Kit Para Análise de Fenótipo de Performance Física, Processo Para dete
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Kit Para Análise de Fenótipo de Performance Física, Processo Para determinação de Fenótipo de Performance Física E Uso do Kit',
        'A presente invenção descreve uma técnica a partir de um teste aqui denominado de Fit-array para
avaliar a avaliação do grau de treinamento físico, baseado na determinação das assinaturas de
expressões gênicas. Assim, o teste visa avaliar o exercício físico com a utilização de bancos dados
de genes transcritos significativos, passíveis de serem avaliados corriqueiramente, ao longo do
tempo, os quais poderiam oferecer um escore gênico para o fenótipo do indivíduo fisicamente
treinado, o escore, seria obtido pela comparação entre um amostrado de um individuo a ser
investigado e uma amostra padrão que seria fornecida de um indivíduo sedentário.',
        'UECE',
        'PATENTE',
        '2018-03-23'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Cassiano Oliveira Moreira', 'Alex Soares Marreiros Ferraz', 'denise Pires de Carvalho', 'Stela Mirla da Silva Felipe', 'Adriano César Carneiro Loureiro', 'Vânia Marilande Ceccato', 'Christina Pacheco Santos Martin', 'Paula Matias Soares', 'Juliana Osório Alves']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A presente
invenção, inventivamente provê um kit e um processo que permite a realização do teste Fit-array.
A presente invenção se situa nos campos da saúde, bioengenharia, esporte e a análise de material
biológico.',
        'BR 10 2018 005850 9',
        'BR 10 2018 005850 9',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2018 005850 9'
          AND p.nome = 'Kit Para Análise de Fenótipo de Performance Física, Processo Para determinação de Fenótipo de Performance Física E Uso do Kit'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [202/242] PATENTE DE INVENÇÃO (Linha 83) - BR 10 2017 027544 2 - Kit Processo Para detecção de Imunoglobulinas E Imunoglobulina G1
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Kit Processo Para detecção de Imunoglobulinas E Imunoglobulina G1',
        'A presente invenção tem por objetivo o diagnóstico de reações alérgicas por meio detecção de
Imunoglobulinas IgE e IgG1 específicas para alimentos in natura, alimentos industrializados,
aditivos alimentares e medicamentos.',
        'UECE',
        'PATENTE',
        '2017-12-20'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Marília Porto Oliveira Nunes', 'Maria Izabel Florindo Guedes', 'Eridan Orlando Pereira Tramontina Florean', 'Maurício Fraga Van Tiuburg']::varchar[],
        'Fundação Universidade Estadual do Ceará e Greenbean Biotecnologia',
        'O teste é específico, não invasivo, fidedigno em seus
resultados, de rápido resultado, o qual em um único teste podem ser testados vários alérgenos,
além de ser de fácil acesso e baixo custo, não necessitando de jejum e podendo ser aplicado
em pessoas de qualquer idade. A presente invenção se situa no campo da medicina e farmácia,
enfermagem, nutrição, biomedicina e bioengenharia, mais especificamente, a análise de material
biológico',
        'BR 10 2017 027544 2',
        'BR 10 2017 027544 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2017 027544 2'
          AND p.nome = 'Kit Processo Para detecção de Imunoglobulinas E Imunoglobulina G1'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [203/242] PATENTE DE INVENÇÃO (Linha 84) - BR 10 2017 027668 6 - Processo Para Obtenção de Filmes A Partir de Blenda Polimérica de Água
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo Para Obtenção de Filmes A Partir de Blenda Polimérica de Água de Coco Em Pó Em Matriz de Galactomanana de Caesalpinia Pulcherrima, Filmes de Blenda Polimérica de Água de Coco Em Pó Em Matriz de Galactomanana de Caesalpinia Pulcherrima, Uso de Filmes de Blenda Polimérica Para Tratamento de Osteorradionecrose',
        'A presente invenção refere-se a um filme elaborado a partir da formulação de blenda polimérica
de água de coco em pó em matriz de galactomanana de Caesalpina pucherrima, o processo de
elaboração do filme de blenda polimérica com aplicação na área de Biotecnologia da Saúde, no
campo da farmácia, visando o tratamento de osteorradionecrose e suas aplicações clínicas.',
        'UECE',
        'PATENTE',
        '2017-12-20'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Eliardo Silveira Santos', 'Felipe domingos de Sousa', 'Ana Cristina de Oliveira Monteiro Moreira', 'Renato Azevedo Moreira', 'José Ferreira Nunes', 'Cristiane Clemente de Mello Salgueiro']::varchar[],
        'Fundação Universidade Estadual do Ceará e Acp Pesquisa, desenvolvimento E Inovação',
        'Esta invenção apresenta a combinação única de componentes naturais, o uso de água de coco em pó e a galactomanana de Caesalpina pulcherrima, para criar um filme com aplicações na área de Biotecnologia da Saúde',
        'BR 10 2017 027668 6',
        'BR 10 2017 027668 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2017 027668 6'
          AND p.nome = 'Processo Para Obtenção de Filmes A Partir de Blenda Polimérica de Água de Coco Em Pó Em Matriz de Galactomanana de Caesalpinia Pulcherrima, Filmes de Blenda Polimérica de Água de Coco Em Pó Em Matriz de Galactomanana de Caesalpinia Pulcherrima, Uso de Filmes de Blenda Polimérica Para Tratamento de Osteorradionecrose'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [204/242] PATENTE DE INVENÇÃO (Linha 85) - BR 10 2017 024814 3 - Processo de Obtenção de Um Extrato Enriquecido Polissacarídico de Caes
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Obtenção de Um Extrato Enriquecido Polissacarídico de Caesalpinia Ferrea, Formulação Tópica A Base de Extratos Enriquecido de Polissacarídeos de Caesalpinia Ferrea, Uso E Processo Para Obtenção Da Mesma',
        'A presente invenção descreve uma nova formulação à base de um produto fitoterápico para o
tratamento de lesões dermatológicas. Especificamente, a presente invenção compreende ao
desenvolvimento de uma formulação à base de extratos enriquecido de polissacarídeos obtidos
da casca do caule da planta Caesalpinia ferrea, preferencialmente na forma de pomada, que pode
ser usada no tratamento de lesões dermatológicas em pacientes normais ou preferencialmente
em pacientes diabéticas ou outras enfermidades que dificultam o processo de cicatrização de
úlceras cutâneas. A presente invenção se situa ramo farmacêutico.',
        'UECE',
        'PATENTE',
        '2017-11-20'::date,
        'Data de Concessão: 2022-10-18',
        NULL, NULL, NULL,
        'Concedido',
        ARRAY['Said Gonçalves da Cruz Fonseca', 'Lívia de Paulo Pereira', 'Maria Gonçalves Pereira', 'Ana Maria Sampaio Assereuy']::varchar[],
        'Fundação Universidade Estadual do Ceará e Universidade Federal do Ceará',
        '-o diferencial tecnológico desta invenção está na abordagem fitoterápica, na escolha específica de extratos enriquecidos de polissacarídeos da planta Caesalpinia ferrea, na apresentação em forma de pomada e no foco em pacientes com dificuldades de cicatrização',
        'BR 10 2017 024814 3',
        'BR 10 2017 024814 3',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2017 024814 3'
          AND p.nome = 'Processo de Obtenção de Um Extrato Enriquecido Polissacarídico de Caesalpinia Ferrea, Formulação Tópica A Base de Extratos Enriquecido de Polissacarídeos de Caesalpinia Ferrea, Uso E Processo Para Obtenção Da Mesma'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [205/242] PATENTE DE INVENÇÃO (Linha 86) - BR 10 2017 024099 1 - Composição Cicatrizante, Usos de Produtos derivados do Coco E Uso Da C
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Composição Cicatrizante, Usos de Produtos derivados do Coco E Uso Da Composição',
        'A presente invenção refere-se a uma composição cicatrizante contendo produtos derivados do
coco (Cocos nucifera L.), particularmente ao uso de água de coco desidratada e óleo de coco extra
virgem, assim como composição cicatrizante contendo água de coco desidratada e óleo de coco
extra virgem para a promoção dos processos de cicatrização.',
        'UECE',
        'PATENTE',
        '2017-11-09'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Cristiane Clemente de Mello Salgueiro', 'Ana Virgínia Lopes Reis Moura', 'Antônia Fádia Alentim de Amorim', 'Antônia debora Sales', 'Everaldo Moura Santos', 'José Ferreira Nunes']::varchar[],
        'Fundação Universidade Estadual do Ceará e Fundação Educacional Jayme de Altavila',
        'O óleo de coco extra virgem é reconhecido por suas propriedades antioxidantes e antimicrobianas. A presença deste óleo na composição pode fornecer benefícios adicionais, como proteção contra infecções e suporte ao processo de cicatrização.',
        'BR 10 2017 024099 1',
        'BR 10 2017 024099 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2017 024099 1'
          AND p.nome = 'Composição Cicatrizante, Usos de Produtos derivados do Coco E Uso Da Composição'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [206/242] PATENTE DE INVENÇÃO (Linha 87) - BR 10 2017 023976 4 - Formulação Para Alimentação Hospitalar E Uso Da Formulação
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Formulação Para Alimentação Hospitalar E Uso Da Formulação',
        'A presente invenção refere-se ao bioproduto à base de água de coco e polímero de dextrose
submetidos a processo adequado de desidratação.',
        'UECE',
        'PATENTE',
        '2017-11-08'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Henrique Jorge Maia Costa', 'José Ferreira Nunes', 'Cristiane Clemente de Mello Salgueiro', 'Flávio Felinto Moura', 'Everaldo Moura Santos']::varchar[],
        'Fundação Universidade Estadual do Ceará e Fundação Educacional Jayme de Altavila',
        'O bioproduto foi elaborado de forma que,
quando reconstituído com água potável, no momento de seu consumo, torne-se uma bebida
hipertônica. Tem aplicação na área de biotecnologia e alimentação hospitalar e seus componentes
promoverão o bem-estar dos pacientes em Protocolo de Aceleração da Recuperação Total
Pósoperatória.',
        'BR 10 2017 023976 4',
        'BR 10 2017 023976 4',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2017 023976 4'
          AND p.nome = 'Formulação Para Alimentação Hospitalar E Uso Da Formulação'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [207/242] PATENTE DE INVENÇÃO (Linha 88) - BR 10 2017 024017 7 - Formulação Bioinseticida de Extrato Aquoso de Folhas desidratadas de N
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Formulação Bioinseticida de Extrato Aquoso de Folhas desidratadas de Nim E Líquido Da Casca de Cocos Verdes E Uso Da Formulação',
        'A presente invenção refere-se a um bioinseticida natural à base de extrato aquoso de folhas
desidratadas de Nim (Azadirachta indica A. Juss.) associado ao líquido da casca de cocos verdes
(Cocos nucifera L.) e seu uso no controle de pragas agrícolas.',
        'UECE',
        'PATENTE',
        '2017-11-08'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['José Ferreira Nunes', 'Cristiane Clemente de Mello Salgueiro', 'Eleonora Osana Farina Sartori', 'Carlucio Roberto Alves']::varchar[],
        'Fundação Universidade Estadual do Ceará e Fundação Educacional Jayme de Altavila',
        'A escolha de ingredientes naturais e a aplicação direcionada para o controle de pragas agrícolas destacam uma abordagem sustentável e de baixo impacto ambiental.',
        'BR 10 2017 024017 7',
        'BR 10 2017 024017 7',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2017 024017 7'
          AND p.nome = 'Formulação Bioinseticida de Extrato Aquoso de Folhas desidratadas de Nim E Líquido Da Casca de Cocos Verdes E Uso Da Formulação'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [208/242] PATENTE DE INVENÇÃO (Linha 89) - BR 10 2017 023613 7 - Sistema Integrado E Método Para Aquisição de Imagens de Exames Otoscóp
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Sistema Integrado E Método Para Aquisição de Imagens de Exames Otoscópicos Para Dispositivos Móveis',
        'A presente invenção descreve um sistema e método para a aquisição, gravação e distribuição de imagens e/ou vídeos de exames clínicos otoscópicos. Especificamente, a presente invenção compreende o uso de qualquer dispositivo móvel acoplado ao sistema proposto que tenha a capacidade de gerar imagens e/ou vídeos e que a partir da interação deste dispositivo com uma fonte de iluminação autônoma e um conjunto óptico autônomo consiga realizar o exame, fazendo com que este seja acessível e de boa qualidade. A presente invenção se situa no campo medicina, medicina veterinária e engenharia.',
        'UECE',
        'PATENTE',
        '2017-11-01'::date,
        NULL,
        NULL, NULL, NULL,
        NULL,
        ARRAY['Paula Lenz Costa Lima', 'Heraldo Jose Barroso Medeiros']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A utilização de dispositivos móveis acoplados ao sistema proposto permite que o exame seja realizado de forma mais conveniente, potencialmente em ambientes diversos, tornando a tecnologia mais acessível.',
        'BR 10 2017 023613 7',
        'BR 10 2017 023613 7',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2017 023613 7'
          AND p.nome = 'Sistema Integrado E Método Para Aquisição de Imagens de Exames Otoscópicos Para Dispositivos Móveis'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [209/242] PATENTE DE INVENÇÃO (Linha 90) - BR 10 2017 022452 0 - Dispositivo Para Criopreservação de Tecidos
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Dispositivo Para Criopreservação de Tecidos',
        'A presente invenção é um dispositivo para vitrificação em superfície sólida constituído de três partes: base, insert e tampa; apresentando-se como um sistema fechado para impedir possíveis contaminações, sendo este dispositivo a ser aplicado na vitrificação de tecido ovariano. A presente invenção se situa no campo da criobiologia e reprodução assistida.',
        'UECE',
        'PATENTE',
        '2017-10-18'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Ana Paula Ribeiro Rodrigues', 'Jamily Bezerra Bruno', 'José Ricardo de Figueiredo']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O diferencial tecnológico dessa invenção está na criação de um dispositivo especializado para a vitrificação em superfície sólida, voltado especificamente para o tecido ovariano. A ênfase em um sistema fechado para prevenir contaminações ressalta a importância da qualidade e integridade do material biológico preservado.',
        'BR 10 2017 022452 0',
        'BR 10 2017 022452 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2017 022452 0'
          AND p.nome = 'Dispositivo Para Criopreservação de Tecidos'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [210/242] PATENTE DE INVENÇÃO (Linha 91) - BR 10 2017 017760 2 - Sistema de Aplicação Medicamentosa Via Goma de Mascar
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Sistema de Aplicação Medicamentosa Via Goma de Mascar',
        'Um sistema de aplicação medicamentosa via goma de mascar, possuindo um material matriz
sem substância líquida e pelo menos uma substância ativa.',
        'UECE',
        'PATENTE',
        '2017-08-18'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Daniel Coimbra Amorim']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Com a mastigação a goma é absorvida através da mucosa da boca, liberando os efeitos desejados.',
        'BR 10 2017 017760 2',
        'BR 10 2017 017760 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2017 017760 2'
          AND p.nome = 'Sistema de Aplicação Medicamentosa Via Goma de Mascar'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [211/242] PATENTE DE INVENÇÃO (Linha 92) - BR 10 2017 009933 4 - Processo de Produção E Uso de Compostos Extraídos do Pó Cerífero Da Ca
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Produção E Uso de Compostos Extraídos do Pó Cerífero Da Carnaúba Para A Preparação de Um Protetor Solar',
        'A presente invenção usa um extrato padronizado contendo uma mistura de diésteres do ácido
cinâmico na elaboração de um filtro solar que possui efeito sinérgico quando utilizado junto com
filtros solares sintéticos, promovendo a manipulação de produtos mais seguros, pois se tornaria
necessária uma concentração menor de ativos sintéticos e consequentemente uma diminuição
ou ausência dos efeitos indesejáveis causados pelos mesmos, como: irritabilidade, alergias,
dermatite de contato, mutações, câncer e/ou atividade estrogênica',
        'UECE',
        'PATENTE',
        '2017-05-11'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Alessandra Ricardo Nunes', 'Maria Izabel Florindo Guedes', 'Selene Maia de Morais', 'Francisca Noelia Pereira Mendes', 'Icaro Gusmão Pinto Vieira']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A invenção destaca a diminuição ou ausência de efeitos indesejáveis causados pelos filtros solares sintéticos, como irritabilidade, alergias, dermatite de contato, mutações, câncer e/ou atividade estrogênica. Isso sugere uma abordagem mais segura para a proteção solar.',
        'BR 10 2017 009933 4',
        'BR 10 2017 009933 4',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2017 009933 4'
          AND p.nome = 'Processo de Produção E Uso de Compostos Extraídos do Pó Cerífero Da Carnaúba Para A Preparação de Um Protetor Solar'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [212/242] PATENTE DE INVENÇÃO (Linha 93) - BR 10 2016 028381 7 - Composição Para Reidratação Durante O Exercício de Atletas E Método de
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Composição Para Reidratação Durante O Exercício de Atletas E Método de Obtenção',
        'A presente invenção refere-se ao bioproduto à base de água de coco e polímero de dextrose
submetidos a processo adequado de desidratação.',
        'UECE',
        'PATENTE',
        '2016-12-02'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Edson Fonseca Pinto', 'Cristiane Clemente de Mello Salgueiro', 'José Ferreira Nunes', 'Henrique Jorge Maia Costa', 'Thiago Renee Felipe', 'Nailton José Brandão de Albuquerque Filho', 'Silvio Alencar Cândido Sobrinho', 'Antonia debora Sales']::varchar[],
        'Fundação Universidade Estadual do Ceará e ACP Biotecnologia',
        'O bioproduto foi elaborado de forma que,
quando reconstituído com água potável, no momento de seu consumo, torne-se uma bebida
levemente hipotônica. Seus componentes promoverão então a reposição hidroeletrolítica e
suplementação energética de atletas.',
        'BR 10 2016 028381 7',
        'BR 10 2016 028381 7',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2016 028381 7'
          AND p.nome = 'Composição Para Reidratação Durante O Exercício de Atletas E Método de Obtenção'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [213/242] PATENTE DE INVENÇÃO (Linha 94) - BR 10 2016 015298 4 - Processo de Produção, Uso E Composição Farmacêutica Compreendendo Comp
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Produção, Uso E Composição Farmacêutica Compreendendo Compostos Extraídos Da Faveleira Na Atividade Anti-Câncer',
        'A presente invenção consiste em composições farmacêuticas e ao uso de compostos extraídos da
faveleira como ingredientes ativos em fármacos para a profilaxia ou o tratamento terapêutico de
uma condição patológica ou doença causada por ou associada ao câncer',
        'UECE',
        'PATENTE',
        '2016-06-29'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Maria Izabel Florindo Guedes', 'Paulo Fernando Machado Paredes', 'Selene Maia de Morais']::varchar[],
        'Fundação Universidade Estadual do Ceará e Greenbean Biotecnologia',
        'A escolha de extrair os compostos ativos da faveleira sugere uma abordagem baseada em fontes naturais. Isso pode ser percebido como uma alternativa ou complemento aos tratamentos convencionais.',
        'BR 10 2016 015298 4',
        'BR 10 2016 015298 4',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2016 015298 4'
          AND p.nome = 'Processo de Produção, Uso E Composição Farmacêutica Compreendendo Compostos Extraídos Da Faveleira Na Atividade Anti-Câncer'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [214/242] PATENTE DE INVENÇÃO (Linha 95) - BR 10 2015 025708 2 - Composição Fitoterápica E Uso do Extrato de Lippia Alba
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Composição Fitoterápica E Uso do Extrato de Lippia Alba',
        'A presente invenção descreve usos para o extrato de Lippia alba relacionados ao tratamento
da ansiedade e a substituição da terapia alopática ansiolítica usualmente empregada.',
        'UECE',
        'PATENTE',
        '2015-10-08'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['José Jackson Coelho Sampaio', 'Valéria Bastos Gomes']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Especificamente, a presente invenção apresenta uma composição fitoterápica compreendendo
extrato de Lippia alba, além de uso do extrato de Lippia alba no preparo de uma composição para
o tratamento de ansiedade e/ou distúrbios relacionados à dependência de medicação ansiolítica.
A presente invenção se situa nos campos da Farmacologia e Farmacognosia.',
        'BR 10 2015 025708 2',
        'BR 10 2015 025708 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2015 025708 2'
          AND p.nome = 'Composição Fitoterápica E Uso do Extrato de Lippia Alba'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [215/242] PATENTE DE INVENÇÃO (Linha 96) - BR 10 2015 024857 1 - Processo Para Obtenção de Alimentos Adicionados de Compostos Orgânicos
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo Para Obtenção de Alimentos Adicionados de Compostos Orgânicos Extraídos Da Cera de Carnaúba',
        'A presente invenção refere-se, de forma geral, a processo de obtenção de alimentos adicionados
de compostos organicos extraidos da cera de carnauba (PCO-C) e a utilidade do PCO-C para o
desenvolvimento de alimentos, especialmente com alegação de propriedades funcionais e ou de
saúde relacionada com as doenças metabólicas como diabetes e dislipidemias.',
        'UECE',
        'PATENTE',
        '2015-09-28'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Maria Izabel Florindo Guedes', 'Ícaro Gusmão Pinto Vieira', 'Claisa Andréa Silva de Freitas']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A inovação está na utilização de compostos orgânicos extraídos da cera de carnaúba como aditivos alimentares.',
        'BR 10 2015 024857 1',
        'BR 10 2015 024857 1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2015 024857 1'
          AND p.nome = 'Processo Para Obtenção de Alimentos Adicionados de Compostos Orgânicos Extraídos Da Cera de Carnaúba'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [216/242] PATENTE DE INVENÇÃO (Linha 97) - BR 10 2015 021357 3 - Método Para Medir O Hematócrito E Uso de Medição Na Região do Infraver
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Método Para Medir O Hematócrito E Uso de Medição Na Região do Infravermelho Próximo Para Monitorar A Hidratação Venosa',
        'A presente invenção descreve uma técnica para determinar o nível de hidratação do organismo.
Suas aplicações estão indicadas para o monitoramento contínuo do processo de hidratação
venosa (HV) durante procedimentos médicos de qualquer natureza.',
        'UECE',
        'PATENTE',
        '2015-09-02'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['José Rubens Costa Lima', 'Paula Lenz Costa Lima', 'Maria Roseli Monteira Callado', 'Regis Barreto Aguiar Fonteles']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'Como resultado de pesquisas
epidemiológicas sobre pacientes de dengue tratados com suspeitas de FHD, percebeu-se
forte associação entre anemia e a gravidade da doença. Com a revisão teórica do processo
fisiopatológico da FHD, reconheceu-se que a forma grave da doença corresponde em todas as
suas fases a uma Síndrome de Supra-Hidratação Aguda (SSHA). A presente invenção se situa nos
campos da medicina e biotecnologia.',
        'BR 10 2015 021357 3',
        'BR 10 2015 021357 3',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2015 021357 3'
          AND p.nome = 'Método Para Medir O Hematócrito E Uso de Medição Na Região do Infravermelho Próximo Para Monitorar A Hidratação Venosa'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [217/242] PATENTE DE INVENÇÃO (Linha 98) - BR 10 2015 019889 2 - Processo de Padronização de Técnicas de Baixo-Custo Utilizando A Produ
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Padronização de Técnicas de Baixo-Custo Utilizando A Produção de Anticorpos Policlonais Para A detecção de Aflatoxinas Em Alimentos',
        'A presente invenção se situa no campo da imunologia e toxicologia e descreve um processo
de padronização da técnica sorológica de baixo custo para a identificação de aflatoxina B1 em
alimentos, utilizando a produção de anticorpos policlonais monoespecíficos para a aflatoxina
B1.',
        'UECE',
        'PATENTE',
        '2015-08-19'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Ícaro Gusmão Pinto Vieira', 'Maria Edite Bezerra da Rocha', 'Maria Izabel Florindo Guedes']::varchar[],
        'Fundação Universidade Estadual do Ceará e Greenbean Biotecnologia',
        'Esse novo método de produção de anticorpos associados à técnica de ELISA indireto e/ou outras, apresenta grande vantagem em relação aos métodos convencionais de diagnóstico, uma vez que detecta a presença do antígeno em alimentos. Ademais, possui alta sensibilidade e especificidade, além de ser seguro e de baixo custo. O teste desenvolvído foi denominado, de “Técnica de Baixo Custo”.',
        'BR 10 2015 019889 2',
        'BR 10 2015 019889 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2015 019889 2'
          AND p.nome = 'Processo de Padronização de Técnicas de Baixo-Custo Utilizando A Produção de Anticorpos Policlonais Para A detecção de Aflatoxinas Em Alimentos'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [218/242] PATENTE DE INVENÇÃO (Linha 99) - BR 10 2015 019890 6 - Processo de Produção de Anticorpos Policlonais Monoespecíficos Anti-Ns
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Produção de Anticorpos Policlonais Monoespecíficos Anti-Ns1/Anti-Pe E Uso de Anticorpos Policlonais Monoespecíficos Anti-Ns1/Anti-Pe Para Padronização de Técnicas de Baixo-Custo',
        'A presente invenção se situa no campo da imunologia e virologia e descreve um processo de
padronização da técnica sorológica de baixo custo para o diagnóstico da dengue, utilizando a
produção de anticorpos policlonais monoespecíficos para a proteína E e NS1 isoladas de sorotipo
do vírus da dengue circulante no Estado do Ceará.',
        'UECE',
        'PATENTE',
        '2015-08-19'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Maria Izabel Florindo Guedes', 'Elza Gadelha Lima', 'Fernanda Montenegro de Carvalho Araújo', 'Ricardo de Carvalho de Azevedo e Sá']::varchar[],
        'Fundação Universidade Estadual do Ceará e Greenbean Biotecnologia',
        'Esse novo método de produção de anticorpos
associados à técnica de ELISA indireto e/ou outras, apresenta grande vantagem em relação aos
métodos convencionais de diagnóstico, uma vez que detecta a presença do antígeno viral no soro
do paciente. Ademais, possui alta sensibilidade e especificidade, além de ser seguro e de baixo
custo. O teste desenvolvido foi denominado de “Técnica de Baixo Custo” TBC NS1 e TBC PE.',
        'BR 10 2015 019890 6',
        'BR 10 2015 019890 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2015 019890 6'
          AND p.nome = 'Processo de Produção de Anticorpos Policlonais Monoespecíficos Anti-Ns1/Anti-Pe E Uso de Anticorpos Policlonais Monoespecíficos Anti-Ns1/Anti-Pe Para Padronização de Técnicas de Baixo-Custo'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [219/242] PATENTE DE INVENÇÃO (Linha 100) - BR 10 2015 019457 9 - desenvolvimento de Meio de Cultura À Base de Água de Coco Em Pó No Pro
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'desenvolvimento de Meio de Cultura À Base de Água de Coco Em Pó No Processo de Diluição E Criopreservação de Sêmen Humano',
        'A presente invenção objetiva o desenvolvimento e análise da eficiência de meio diluente à base
de água de coco em pó ACP-113c) comparado ao meio convencional padrão ouro no mercado
— Freezing Medium test yolk buffer (TYB) e meio preconizado pela OMS — Gema de ovo-citratoglicerol (GEYC), em protocolo modificado de criopreservação para sêmen humano, proporcionando
o uso da água de coco em pó (ACP) ou liofilizada como diluente para a conservação do sêmen
humano a fresco, refrigerado ou congelado em programas de reprodução humana assistida.',
        'UECE',
        'PATENTE',
        '2015-08-13'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Erika Caldas Silveira', 'Edilson Divino de Araújo', 'José Ferreira Nunes', 'Cristiane Clemente de Mello Salgueiro']::varchar[],
        'Fundação Universidade Estadual do Ceará, Centro de Medicina Integrada de Sergipe e Acp Pesquisa, desenvolvimento E Inovação',
        'A inovação está integrada a um protocolo modificado de criopreservação para sêmen humano. Esse protocolo envolve técnicas específicas que visam melhorar a viabilidade e a eficiência do processo de criopreservação.',
        'BR 10 2015 019457 9',
        'BR 10 2015 019457 9',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2015 019457 9'
          AND p.nome = 'desenvolvimento de Meio de Cultura À Base de Água de Coco Em Pó No Processo de Diluição E Criopreservação de Sêmen Humano'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [220/242] PATENTE DE INVENÇÃO (Linha 101) - BR 10 2015 018260 0 - Uso de Extrato de Plantas do Gênero Croton, Uso de Estragol, Uso de An
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Uso de Extrato de Plantas do Gênero Croton, Uso de Estragol, Uso de Anetol E Método de Tratamento de Neuropatias',
        'A presente invenção descreve uso o extrato de plantas do gênero
Croton e seus componentes, estragol e anetol, para tratamento de neuropatias,
bem como métodos de tratamento de neuropatias.',
        'UECE',
        'PATENTE',
        '2015-07-30'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Andrelina Noronha Coelho de Souza', 'Vânia Marilande Ceccatto', 'Aline Alice Cavalcante Albuquerque', 'Francisco Walber Ferreira da Silva', 'Kerly Shamyra da Silva Alves', 'Flávio Henrique Pequeno de Macêdo', 'Morgana Barroso Oquendo']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A presente invenção
também compreende o uso do extrato de plantas do gênero Croton no preparo
de composições para tratamento de neuropatias em geral e neuropatias
diabéticas de maneira independente da redução da glicemia A presente
invenção se situa nos campos da Farmácia, Fisiopatologia e Farmacognosia.',
        'BR 10 2015 018260 0',
        'BR 10 2015 018260 0',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2015 018260 0'
          AND p.nome = 'Uso de Extrato de Plantas do Gênero Croton, Uso de Estragol, Uso de Anetol E Método de Tratamento de Neuropatias'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [221/242] PATENTE DE INVENÇÃO (Linha 102) - BR 10 2014 016754 4 - Processo de Criopreservação de Sêmen de Mamífero E Diluente de Sêmen C
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Criopreservação de Sêmen de Mamífero E Diluente de Sêmen Com Produtos Naturais',
        'A presente invenção refere-se, de forma geral, ao uso da água de coco em pó (ACP) ou desidratada sem a adição de gema de ovo e adicionada de óleos vegetais como diluente para a congelação do sémen de mamíferos em programas de reprodução assistida. A presente invenção se situa no campo da biotecnologia.',
        'UECE',
        'PATENTE',
        '2014-07-07'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Bárbara Mara Bandeira Santos', 'José Ferreira Nunes', 'Cristiane Clemente de Mello Salgueiro', 'Carminda Sandra Brito Salmito-Vanderley', 'Márcia Helena Niza Ramalho Sobral', 'Bruna Farias Brito', 'Priscila Palácio de Queiroz Farias']::varchar[],
        'Fundação Universidade Estadual do Ceará e ACP Biotecnologia',
        '-o diferencial tecnológico desta invenção está na formulação específica do diluente para a congelação do sêmen de mamíferos, utilizando água de coco em pó (ACP) ou desidratada, sem a adição de gema de ovo, e com a adição de óleos vegetais.',
        'BR 10 2014 016754 4',
        'BR 10 2014 016754 4',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2014 016754 4'
          AND p.nome = 'Processo de Criopreservação de Sêmen de Mamífero E Diluente de Sêmen Com Produtos Naturais'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [222/242] PATENTE DE INVENÇÃO (Linha 103) - BR 10 2014 010613 8 - Processo de Extração de Compostos Orgânicos
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Extração de Compostos Orgânicos',
        'A presente invenção descreve um processo de extração de compostos orgânicos derivados de
plantas. Especificamente, a presente invenção compreende as etapas de extração a frio do pó
de carnaúba com uma mistura de solventes orgânicos, separação da mistura e concentração
do solvente para a obtenção do material resinoso.',
        'UECE',
        'PATENTE',
        '2014-05-02'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Maria Izabel Florindo Guedes', 'Claisa Andréa Silva de Freitas', 'Ícaro Gusmão Pinto Vieira', 'Isaac Neto Goes da Silva', 'Francisca Noelia Pereira Mendes', 'Paula Alves Salmito Rodrigues']::varchar[],
        'Fundação Universidade Estadual do Ceará e Greenbean Biotecnologia',
        'Após a extração, a invenção inclui etapas de separação da mistura resultante e concentração do solvente para obter o material resinoso. Essas etapas são essenciais para isolar e purificar os compostos orgânicos extraídos, garantindo a obtenção de um produto final de alta qualidade.',
        'BR 10 2014 010613 8',
        'BR 10 2014 010613 8',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2014 010613 8'
          AND p.nome = 'Processo de Extração de Compostos Orgânicos'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [223/242] PATENTE DE INVENÇÃO (Linha 104) - BR 10 2014 010616 2 - Composição Farmacêutica Para O Tratamento Da dengue, Uso de Fucoidanas
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Composição Farmacêutica Para O Tratamento Da dengue, Uso de Fucoidanas E Processo de Produção de Composição Farmacêutica',
        'A presente invenção consiste em composições farmacêuticas para o tratamento da dengue
e no uso de fucoidanas como um ingrediente antiviral ativo em fármacos para a profilaxia ou
o tratamento terapêutico de uma condição patológica ou doença causada por ou associada
com uma infecção por dengue',
        'UECE',
        'PATENTE',
        '2014-05-02'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Tadeu Rocha Pontes Filho', 'Edda Lisboa Leite', 'Maria Izabel Florindo Guedes', 'Márcia Maria Mendes Marques']::varchar[],
        'Fundação Universidade Estadual do Ceará e Greenbean Biotecnologia',
        'A invenção possui como diferencial, o tratamento da dengue, através de um processo de produção de
composição farmacêutica.',
        'BR 10 2014 010616 2',
        'BR 10 2014 010616 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2014 010616 2'
          AND p.nome = 'Composição Farmacêutica Para O Tratamento Da dengue, Uso de Fucoidanas E Processo de Produção de Composição Farmacêutica'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [224/242] PATENTE DE INVENÇÃO (Linha 105) - BR 10 2014 010615 4 - Composição Farmacêutica Para O Tratamento Da dengue, Uso de Galactoman
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Composição Farmacêutica Para O Tratamento Da dengue, Uso de Galactomananas E Processo de Produção de Composição Farmacêutica',
        'A presente invenção consiste em composições farmacêuticas e ao uso de galactomananas como
um ingrediente antiviral ativo em fármacos para a profilaxia ou o tratamento terapêutico de
uma condição patológica ou doença causada por ou associada com uma infecção por dengue.',
        'UECE',
        'PATENTE',
        '2014-05-02'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Tadeu Rocha Pontes Filho', 'Ana Raquel Araujo Silva', 'Maria Izabel Florindo Guedes', 'Márcia Maria Mendes Marques', 'Lia Magalhães de Almeida', 'Selene Maia de Morais', 'Ícaro Gusmão Pinto Vieira', 'Isaac Neto Goes da Silva', 'Francisco Antônio Tomaz Ribeiro Ramos']::varchar[],
        'Fundação Universidade Estadual do Ceará e Greenbean Biotecnologia',
        'A invenção também apresenta um processo de produção de composição farmacêutica.',
        'BR 10 2014 010615 4',
        'BR 10 2014 010615 4',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2014 010615 4'
          AND p.nome = 'Composição Farmacêutica Para O Tratamento Da dengue, Uso de Galactomananas E Processo de Produção de Composição Farmacêutica'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [225/242] PATENTE DE INVENÇÃO (Linha 106) - BR 10 2014 010614 6 - Composição Para Cicatrização de Feridas, Seus Usos E Processos de Prep
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Composição Para Cicatrização de Feridas, Seus Usos E Processos de Preparação',
        'A presente invenção descreve composições para cicatrização de feridas cutâneas ou em mucosas
e o processo de fabricação das composições.',
        'UECE',
        'PATENTE',
        '2014-05-02'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Maria Izabel Florindo Guedes', 'Márcia Maria Mendes Marques', 'Selene Maia de Morais', 'Isaac Neto Goes da Silva', 'Francisco Antônio Tomaz Ribeiro Ramos', 'Micheline Soares Costa Oliveira', 'Ícaro Gusmão Pinto Vieira']::varchar[],
        'Fundação Universidade Estadual do Ceará e Greenbean Biotecnologia',
        'Especificamente, a presente invenção compreende
composições compreendendo ácido anacárdico e um veículo farmaceuticamente aceitável.',
        'BR 10 2014 010614 6',
        'BR 10 2014 010614 6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2014 010614 6'
          AND p.nome = 'Composição Para Cicatrização de Feridas, Seus Usos E Processos de Preparação'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [226/242] PATENTE DE INVENÇÃO (Linha 107) - BR 10 2013 033108 2 - Processo de Obtenção de Eletrodo Impresso Modificado Com Nanopartícula
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Obtenção de Eletrodo Impresso Modificado Com Nanopartículas de Ouro',
        'A presente invenção descreve um novo e inventivo processo de eletrodeposição para produção
de eletrodo impresso modificado com nanopartículas de ouro, produzido pela técnica
“screen printing”.',
        'UECE',
        'PATENTE',
        '2013-12-20'::date,
        'Data de Concessão: 2021-07-06',
        NULL, NULL, NULL,
        'Concedido',
        ARRAY['Roselayne Ferro Furtado', 'Carlucio Roberto Alves', 'Maria Gaderny Ribeiro Pimenta- Martins', 'Rosa Fireman Dutra', 'Maria de Fátima Borges']::varchar[],
        'Fundação Universidade Estadual do Ceará e Empresa Brasileira de Pesquisa Agropecuária',
        'O processo descrito possui, como principais vantagens, a fácil preparação,
boa biocompatibilidade e disponibilização de maior área superficial a dispositivos, aumento
considerável da condutividade, transferência de elétrons e, ainda, da sensibilidade e especificidade
analítica.',
        'BR 10 2013 033108 2',
        'BR 10 2013 033108 2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2013 033108 2'
          AND p.nome = 'Processo de Obtenção de Eletrodo Impresso Modificado Com Nanopartículas de Ouro'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [227/242] PATENTE DE INVENÇÃO (Linha 108) - BR 10 2012 017911 3 - Dispositivo de Criopreservação E Processos de Vitrificação E Aquecimen
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Dispositivo de Criopreservação E Processos de Vitrificação E Aquecimento Utilizando Tal Dispositivo',
        'A presente invenção descreve um dispositivo de criopreservação utilizado durante processos
de vitrificação de tecidos biológicos reprodutores.',
        'UECE',
        'PATENTE',
        '2012-07-19'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Ana Paula Ribeiro Rodrigues', 'José Ricardo de Figueiredo', 'Adeline de Andrade Carvalho', 'Luciana Rocha Faustino', 'Simone Vieira Castro', 'Cleidson Manoel Gomes da Silva']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O dispositivo permite maior facilidade no
abastecimento e retirada da solução crioprotetora, bem como a vitrificação de diferentes
dimensões de tecido ovariano em um mesmo dispositivo. A presente invenção também versa
sobre processos de vitrificação e aquecimento utilizando o referido dispositivo de crio preservação.',
        'BR 10 2012 017911 3',
        'BR 10 2012 017911 3',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'BR 10 2012 017911 3'
          AND p.nome = 'Dispositivo de Criopreservação E Processos de Vitrificação E Aquecimento Utilizando Tal Dispositivo'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [228/242] PATENTE DE INVENÇÃO (Linha 109) - PI 1106374-2 - Processo de Produção de Proteína P28 Em Plantas, E Uso Da Proteína P28
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Produção de Proteína P28 Em Plantas, E Uso Da Proteína P28 Na Preparação de Vacina Contra A Artrite Encefalite Caprina',
        'A presente invenção proporciona um vantajoso processo de produção da proteína p28 do vírus
da artrite encefalite caprina (CAEV), utilizando o vírus do mosaico do caupi (CPMV) como vetor e
sua inoculação em plantas de feijão-de-corda.',
        'UECE',
        'PATENTE',
        '2011-09-20'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Maria Izabel Florindo Guedes', 'Lia Magalhães de Almeida', 'Isaac Neto Goes da Silva', 'Francisco Jarbas Santos de Sousa', 'Emanuele Silva de Sousa', 'Márcia Maria Mendes Marques', 'Silmaria Celestino Costa Santos', 'Victor Emanuel Pessoa Martins', 'Maria Lúcia Torres Franklin']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'São também reveladas as condições para o uso da
proteína p28 assim obtida na preparação de um imunógeno contra o CAE.',
        'PI 1106374-2',
        'PI 1106374-2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'PI 1106374-2'
          AND p.nome = 'Processo de Produção de Proteína P28 Em Plantas, E Uso Da Proteína P28 Na Preparação de Vacina Contra A Artrite Encefalite Caprina'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [229/242] PATENTE DE INVENÇÃO (Linha 110) - PI 1106369-6 - Processo de Colheita, Diluição E Conservação de Sêmen Aviário, Diluent
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Colheita, Diluição E Conservação de Sêmen Aviário, Diluente de Sêmen Aviário E, Processo de Fertilização',
        'A presente invenção refere-se, de forma geral, ao uso da água de coco em pó (ACP) ou desidratada
como diluente para a conservação do sêmen fresco, refrigerado ou congelado de aves domésticas
e exóticas em programas de reprodução animal assistida. A',
        'UECE',
        'PATENTE',
        '2011-09-20'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Carlos Tadeu Bandeira de Lavor', 'José Ferreira Nunes', 'José Maciel Andrade', 'Carminda Sandra Salmito-Vanderley', 'Márcia Helena Niza Ramalho Sobral', 'Suiany Rodrigues Câmara', 'Cristiane Clemente de Mello', 'Bárbara Mara Bandeira Santos']::varchar[],
        'Fundação Universidade Estadual do Ceará e Acp Pesquisa, desenvolvimento E Inovação',
        'A inovação tem aplicação direta em programas de reprodução animal assistida, onde a conservação do sêmen é uma prática comum para facilitar a inseminação artificial, preservar a diversidade genética e melhorar a eficiência reprodutiva das aves.',
        'PI 1106369-6',
        'PI 1106369-6',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'PI 1106369-6'
          AND p.nome = 'Processo de Colheita, Diluição E Conservação de Sêmen Aviário, Diluente de Sêmen Aviário E, Processo de Fertilização'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [230/242] PATENTE DE INVENÇÃO (Linha 111) - PI 1104672-4 - Processo de Produção de Ovário Artificial E Método E Kit de detecção d
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Produção de Ovário Artificial E Método E Kit de detecção de Sensibilidade A Substâncias Utilizando Tecido Ovariano',
        'A presente invenção relata um processo de produção de meios para cultivo in vitro adequado que
permita a sobrevivência, crescimento, maturação e posterior fecundação de pequenos oócitos
oriundos de folículos pré-antrais, prevenindo a atresia folicular que ocorre abundantemente nos
ovários e métodos/kit para detecção de sensibilidade a substâncias utilizando tecido ovariano.',
        'UECE',
        'PATENTE',
        '2011-08-31'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Ana Paula Ribeiro Rodrigues', 'José Ricardo de Figueiredo', 'Fabrício Sousa Martins']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A capacidade de cultivar e maturar oócitos in vitro é particularmente relevante para técnicas de reprodução assistida, como a fertilização in vitro (FIV). Essa aplicação pode beneficiar tratamentos de fertilidade e pesquisas relacionadas à reprodução.',
        'PI 1104672-4',
        'PI 1104672-4',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'PI 1104672-4'
          AND p.nome = 'Processo de Produção de Ovário Artificial E Método E Kit de detecção de Sensibilidade A Substâncias Utilizando Tecido Ovariano'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [231/242] PATENTE DE INVENÇÃO (Linha 112) - PI 1103290-1 - Processo de Produção de Meio de Cultivo E Isolamento de Bactérias, Mei
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Produção de Meio de Cultivo E Isolamento de Bactérias, Meio de Cultivo E Isolamento E Método de Cultivo E Isolamento',
        'A presente invenção refere-se, de forma geral, ao uso de água de coco como meio de cultura
destinados ao cultivo- e isolamento de bactérias, particularmente ao uso da água de coco
desidratada para esse fim, assim como composições de meios de cultura contendo água de coco
desidratada suplementada com fontes nitrogenadas.',
        'UECE',
        'PATENTE',
        '2011-07-05'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Suiany Rodrigues Câmara', 'José Ferreira Nunes', 'José Maciel Andrade', 'Maria Izabel Florindo Guedes', 'Carlos Tadeu Bandeira de Lavor', 'Ana Lucia Figueiredo Porto', 'Cristiane Clemente de Mello Salgueiro']::varchar[],
        'Fundação Universidade Estadual do Ceará, Universidade Federal Rural de Pernambuco / Acp Pesquisa, desenvolvimento E Inovação',
        'A água de coco desidratada, com ou sem suplementos nitrogenados, pode oferecer benefícios nutricionais que melhoram a eficiência do cultivo bacteriano, proporcionando um ambiente mais adequado.',
        'PI 1103290-1',
        'PI 1103290-1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'PI 1103290-1'
          AND p.nome = 'Processo de Produção de Meio de Cultivo E Isolamento de Bactérias, Meio de Cultivo E Isolamento E Método de Cultivo E Isolamento'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [232/242] PATENTE DE INVENÇÃO (Linha 113) - PI 1102000-8 - Processo de Produção de Anticorpos Anti Imnv, Método E Kit de Diagnóst
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Produção de Anticorpos Anti Imnv, Método E Kit de Diagnóstico Precoce do Vírus Da Mionecrose Infecciosa',
        'A presente invenção envolve a identificação do IMNV (vírus da mionecrose infecciosa), o processo
de produção de anticorpos policlonais específicos para o vírus da mionecrose infecciosa e um kit
de diagnóstico por ser uma estratégia rápida, especifica e eficaz.',
        'UECE',
        'PATENTE',
        '2011-04-20'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Maria Izabel Florindo Guedes', 'Maria Verônyca Coelho Melo', 'Silmária Celestino Costa Santos', 'Elza Gadelha Lima', 'Aíla Maria Souza Fontenele Duarte', 'Maria Lúcia Torres Franklin', 'Maria Erivalda Farias de Aragão']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A invenção inclui o processo de produção de anticorpos policlonais específicos para o IMNV. Os anticorpos policlonais são capazes de reconhecer diferentes epítopos do vírus, aumentando a sensibilidade e especificidade do diagnóstico.',
        'PI 1102000-8',
        'PI 1102000-8',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'PI 1102000-8'
          AND p.nome = 'Processo de Produção de Anticorpos Anti Imnv, Método E Kit de Diagnóstico Precoce do Vírus Da Mionecrose Infecciosa'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [233/242] PATENTE DE INVENÇÃO (Linha 114) - PI 1101451-2 - Meio de Preservação de Tecido Animal, Processo de Produção do Meio E P
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Meio de Preservação de Tecido Animal, Processo de Produção do Meio E Processo de Preservação de Tecido Animal',
        'A presente invenção descreve um processo de preservação de tecido animal, preferencialmente
de tecido ovariano caprino compreendendo a etapa de exposição do tecido ovaríano ao
Propanodiol (PROH), e antioxidantes, estes sendo Troíox e/ou Catalase seguido de criopreservação.',
        'UECE',
        'PATENTE',
        '2011-04-19'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Ana Paula Ribeiro Rodrigues', 'José Ricardo de Figueiredo', 'Hiédely Kenia Machado Luz']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'a presente invenção descreve um meio de preservação de tecido animal compreendendo Propanodiol (PROH), Trolox e/ou Catalase.',
        'PI 1101451-2',
        'PI 1101451-2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'PI 1101451-2'
          AND p.nome = 'Meio de Preservação de Tecido Animal, Processo de Produção do Meio E Processo de Preservação de Tecido Animal'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [234/242] PATENTE DE INVENÇÃO (Linha 115) - PI 1101610-8 - Meio de Diluição de Sêmen Canídeo E Processo de Preservação do Mesmo
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Meio de Diluição de Sêmen Canídeo E Processo de Preservação do Mesmo',
        'A presente invenção refere-se, de forma geral, ao uso da água de coco em pó (ACP) ou desidratada
adicionada de crioprotetores como diluente para a congelação do sêmen de canideos domésticos
e selvagens em programas de reprodução animal assistida.',
        'UECE',
        'PATENTE',
        '2011-04-06'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['José Ferreira Nunes', 'Janaína de Fátima Saraiva Cardoso', 'Lúcia Daniel Machado da Silva']::varchar[],
        'Fundação Universidade Estadual do Ceará e Acp Pesquisa, desenvolvimento E Inovação',
        'A presença de crioprotetores no diluente destaca a consideração de componentes que auxiliam na proteção das células espermáticas durante o processo de congelação.',
        'PI 1101610-8',
        'PI 1101610-8',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'PI 1101610-8'
          AND p.nome = 'Meio de Diluição de Sêmen Canídeo E Processo de Preservação do Mesmo'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [235/242] PATENTE DE INVENÇÃO (Linha 116) - PI 1100532-7 - Processo de Produção de Proteínas do Vírus Da dengue Em Plantas, E Uso
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Produção de Proteínas do Vírus Da dengue Em Plantas, E Uso de Proteínas Na Preparação de Vacina Contra A dengue',
        'A presente invenção proporciona um vantajoso processo de produção da proteína envelope do
vírus dengue (proteína E), utilizando o vírus do mosaico do caupi (CPMV) como vetor.',
        'UECE',
        'PATENTE',
        '2011-02-16'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Maria Izabel Florindo Guedes', 'Lia Magalhães de Almeida', 'Isaac Neto Goes da Silva', 'Maria Lucia Torres Franklin', 'Francisco Jarbas Santos de Sousa', 'Sérgio Marcelo Rodriguez Málaga']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'É também
revelado o uso da proteína E na preparação de imunógeno contra a dengue.',
        'PI 1100532-7',
        'PI 1100532-7',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'PI 1100532-7'
          AND p.nome = 'Processo de Produção de Proteínas do Vírus Da dengue Em Plantas, E Uso de Proteínas Na Preparação de Vacina Contra A dengue'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [236/242] PATENTE DE INVENÇÃO (Linha 117) - PI 1100032-5 - Processo de Diluição E Presevação de Sêmen de Canídeos
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Diluição E Presevação de Sêmen de Canídeos',
        'A presente invenção proporciona o uso da água de coco em pó (ACP) ou desidratada como
diluente para a conservação do sêmen fresco, refrigerado ou congelado de canídeos domésticos
e selvagens em programas de reprodução animal assistida.',
        'UECE',
        'PATENTE',
        '2011-01-06'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Cristiane Clemente de Mello Salgueiro', 'José Ferreira Nunes', 'Daniel Couto Uchoa', 'Lúcia Daniel Machado da Silva']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A inovação está na utilização específica da água de coco em pó ou desidratada como diluente para a conservação do sêmen de canídeos. Isso representa uma abordagem alternativa aos diluentes tradicionais usados na preservação do sêmen animal.',
        'PI 1100032-5',
        'PI 1100032-5',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'PI 1100032-5'
          AND p.nome = 'Processo de Diluição E Presevação de Sêmen de Canídeos'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [237/242] PATENTE DE INVENÇÃO (Linha 118) - PI 1005032-9 - Processo de Obtenção de Meio Manutenção E Crescimento Celular, Meio Ob
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Obtenção de Meio Manutenção E Crescimento Celular, Meio Obtido E Método de Cultivo de Células',
        'A presente invenção refere-se, de forma geral, ao uso da água de coco em pó (ACP) ou desidratada
como meio de manutenção e/ou crescimento de células, preferencialmente para células clone
C~6/36~ (Aedes albopictus).',
        'UECE',
        'PATENTE',
        '2010-12-30'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Cristiane Clemente de Mello Salgueiro', 'José Maciel de Andrade Santos', 'José Ferreira Nunes', 'Isaac Neto Goes da Silva', 'Suiany Rodrigues Câmara', 'Maria Izabel Florindo Guedes', 'Márcia Maria Mendes Marques', 'Ana Raquel Araújo Silva']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A água de coco, devido à sua composição nutricional, pode fornecer nutrientes e fatores de crescimento que são benéficos para o cultivo celular. Isso pode resultar em condições de cultura celular mais favoráveis, contribuindo para o crescimento e a manutenção celular eficientes.',
        'PI 1005032-9',
        'PI 1005032-9',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'PI 1005032-9'
          AND p.nome = 'Processo de Obtenção de Meio Manutenção E Crescimento Celular, Meio Obtido E Método de Cultivo de Células'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [238/242] PATENTE DE INVENÇÃO (Linha 119) - PI 1010496-8 - Processo de Obtenção de Adjuvante Para Vacinas Aviárias
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Obtenção de Adjuvante Para Vacinas Aviárias',
        'Uso da água de coco em pó (ACP) ou desidratada como adjuvante para vacinas aviárias,
particularmente para vacinas vivas aviárias aplicadas por diferentes vias.',
        'UECE',
        'PATENTE',
        '2010-12-30'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Cristiane Clemente de Mello Salgueiro', 'Márcia Helena Niza Ramalho Sobral', 'José Ferreira Nunes', 'Vinícius Madureira Maia']::varchar[],
        'Fundação Universidade Estadual do Ceará e C C de M Salgueiro (ACP Biotecnologia)',
        'O adjuvante à base de água de coco pode ter propriedades que impactam positivamente na eficácia da resposta imunológica à vacinação, melhorando a proteção oferecida pelas vacinas aviárias.',
        'PI 1010496-8',
        'PI 1010496-8',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'PI 1010496-8'
          AND p.nome = 'Processo de Obtenção de Adjuvante Para Vacinas Aviárias'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [239/242] PATENTE DE INVENÇÃO (Linha 120) - PI 1009940-9 - Processo de Re-Diluição de Sêmen Bovino
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Re-Diluição de Sêmen Bovino',
        'A presente invenção refere-se a um processo de manipulação do sêmen bovino visando à rediluição deste congelado-descongelado em meio à base de água de coco em pó (ACP-111). O
processo que trata a invenção proporciona a redução à metade da concentração espermática da
dose de sêmen utilizada em palhetas de sêmen congeladodescongelado, melhorando os indices
de fertilidade e apresentando uma grande aplicabilidade para as indústrias que comercializam
o sêmen bovino',
        'UECE',
        'PATENTE',
        '2010-12-21'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Vanessa Porto Machado', 'José Ferreira Nunes', 'Cibele Cavalcante Souza de Melo', 'Rômulo José Vieira', 'Cristiane Clemente de Mello Salgueiro']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'A invenção descreve um método simples, rápido e prático de re-diluição do
sêmen bovino em meio à base de água de coco em pó (ACP-111) após a descongelação de doses
de sêmen vendidas comercialmente que foram congeladas em diluente à base de citrato-gemaglicerol.',
        'PI 1009940-9',
        'PI 1009940-9',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'PI 1009940-9'
          AND p.nome = 'Processo de Re-Diluição de Sêmen Bovino'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [240/242] PATENTE DE INVENÇÃO (Linha 121) - PI 1012429-2 - Processo de Produção, Uso E Composição Farmacêutica Compreendendo Comp
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Produção, Uso E Composição Farmacêutica Compreendendo Compostos Obtidos A Partir de Cera de Carnaúba',
        'A presente invenção refere-se a certos novos derivados isolados da cera de carnaúba, a processos
para preparar tais compostos e a utilidade da fração isolada da cera da carnaúba (PCOC) em
produtos farmacêuticos, especialmente para o tratamento de diabetes e dislipidemias e a
composição farmacêuticas contendo compostos obtidos a partir da cera de carnaúba',
        'UECE',
        'PATENTE',
        '2010-09-29'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Icaro Gusmão Pinto Vieira', 'Carlucio Roberto Alves', 'Lia Magalhães de Almeida', 'Maria Izabel Florindo Guedes', 'Francisca Noélia Pereira Mendes', 'Luis Sérgio Fonteles Duarte', 'Maria Goretti Rodrigues de Queiroz', 'Antônio Carlos Vasconcelos Arruda Filho']::varchar[],
        'Fundação Universidade Estadual do Ceará, Banco do Nordeste do Brasil S.A / Universidade Federal do Ceara',
        'Em espcial,
a atividade da fração isolada da cera da carnaúba se deve a presença de substâncias classificadas
quimicamente como ésteres do acido cinâmico',
        'PI 1012429-2',
        'PI 1012429-2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'PI 1012429-2'
          AND p.nome = 'Processo de Produção, Uso E Composição Farmacêutica Compreendendo Compostos Obtidos A Partir de Cera de Carnaúba'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [241/242] PATENTE DE INVENÇÃO (Linha 122) - PI 1002346-1 - Processo de Obtenção de Água de Coco desidratada E Produto Resultante
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Obtenção de Água de Coco desidratada E Produto Resultante',
        'Mais particularmente, o processo de obtenção de água de coco desidratada e produto resultante,
mais especificamente diz respeito ao beneficiamento do líquido endospérmico do coco (Cocos
nucifera L.) para a produção de água de coco em pó (ACP) através de processo térmico;',
        'UECE',
        'PATENTE',
        '2010-07-19'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Cristiane Clemente de Mello Salgueiro', 'José Ferreira Nunes', 'Daniel Couto Uchoa', 'Lúcia Daniel Machado da Silva']::varchar[],
        'Fundação Universidade Estadual do Ceará e ACP Biotecnologia Industrial Ltda',
        'o processo
de obtenção de água de coco desidratada consiste no fato de que todas as etapas garante que
o pó resultante (ACP) seja padronizado e estabilizado, apresentando potencial para a elaboração
de inúmeros produtos, mantendo algumas características químicas originais e otimizando outras
características em relação à água de coco “in natura”, mantendo maior validade e menor custo
do que outros diluentes.',
        'PI 1002346-1',
        'PI 1002346-1',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'PI 1002346-1'
          AND p.nome = 'Processo de Obtenção de Água de Coco desidratada E Produto Resultante'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

-- [242/242] PATENTE DE INVENÇÃO (Linha 123) - PI 1004458-2 - Processo de Produção, Uso E Composição Fungicida Compreendendo Compost
WITH nova_protecao AS (
    INSERT INTO public.protecoes (
        nome, resumo, instituicao, natureza, data_deposito, info_extra,
        area, nivel_maturidade, aplicacao, status, inventores, titular,
        diferencial_tecnologico, numero_protocolo, cod_id, ativo, user_inclusao_id, jogo_id
    )
    SELECT
        'Processo de Produção, Uso E Composição Fungicida Compreendendo Compostos Obtidos A Partir do Líquido Da Casca Da Castanha de Caju',
        'A presente invenção refere-se a um novo derivado de um composto químico obtido a partir de
um composto do líquido da casca da castanha de caiu, processos para preparar tais compostos e
a utilização em produtos agroquímicos, especialmente em fungicidas.',
        'UECE',
        'PATENTE',
        '2010-05-12'::date,
        NULL,
        NULL, NULL, NULL,
        'Arquivado',
        ARRAY['Maria Izabel Florindo Guedes', 'Carlucio Roberto Alves', 'Francisco das Chagas de Oliveira Freire', 'Lia Magalhães de Almeida', 'Rômulo Aldo de Oliveira Castro', 'Joana D’Arc Pereira Dantas']::varchar[],
        'Fundação Universidade Estadual do Ceará',
        'O diferencial está na aplicação direta desses compostos na fabricação de produtos agroquímicos, com destaque para fungicidas. Isso sugere que o composto ou seu derivado tem propriedades que podem ser benéficas no controle de fungos em culturas agrícolas.',
        'PI 1004458-2',
        'PI 1004458-2',
        true,
        (SELECT id FROM public.usuarios WHERE role = 'ADMIN' ORDER BY id LIMIT 1),
        NULL
    WHERE NOT EXISTS (
        SELECT 1 FROM public.protecoes p
        WHERE p.numero_protocolo = 'PI 1004458-2'
          AND p.nome = 'Processo de Produção, Uso E Composição Fungicida Compreendendo Compostos Obtidos A Partir do Líquido Da Casca Da Castanha de Caju'
    )
    RETURNING id_protecao
)
INSERT INTO public.protecao_tipos (protecao_id, tipo)
SELECT id_protecao, 'PATENTE_INVENCAO' FROM nova_protecao;

COMMIT;
