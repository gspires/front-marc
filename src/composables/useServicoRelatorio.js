import api from 'src/services/api';

export function useServicoRelatorio() {


    const createServicoRelatorio = async (relatorio) => {
        try {
            const response = await api.post('/servico-relatorio', relatorio)
            return { success: true, data: response.data, message: 'Relatório criado com sucesso!' }
        } catch (error) {
            console.error('Erro ao buscar o serviço relatório:', error);
            return { success: false, message: error };
        }
    }

    const findServicoRelatorios = async () => {
        try {
            const response = await api.get('/servico-relatorio')
            return { success: true, data: response.data }
        } catch (error) {
            console.error('Erro ao buscar o serviço relatório:', error);
            return { success: false, message: error };
        }
    }

    const findServicoRelatorio = async (id) => {
        try {
            const response = await api.get(`/servico-relatorio/${id}`)
            return { success: true, data: response.data }
        } catch (error) {
            console.error('Erro ao buscar o Serviço Relatório:', error);
            return { success: false, message: error };
        }
    }
    const updateServicoRelatorio = async (id, relatorio) => {
        try {
            const response = await api.put(`/servico-relatorio/${id}`, relatorio)
            console.log(relatorio)
            return { success: true, data: response.data, message: 'Alterado o relatório do serviço com sucesso!' }
        } catch (error) {
            console.error('Erro ao relaroio do serviço com sucesso:', error);
            return { success: false, message: error };
        }
    }
    return {
        createServicoRelatorio,
        findServicoRelatorios,
        findServicoRelatorio,
        updateServicoRelatorio
    }

} 