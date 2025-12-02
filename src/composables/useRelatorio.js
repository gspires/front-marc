import api from 'src/services/api';

export function useRelatorio() {


    const createServicoConsulta = async (servicoConsulta) => {
        try {
            const response = await api.post(`/relatorio-consulta`, servicoConsulta)
            return { success: true, data: response.data, message: 'Serviço consulta cadastrado com sucesso!' }
        } catch (error) {
            console.error('Erro ao cadastrar o Serviço consulta:', error);
            return { success: false, message: error };
        }
    }

    const findRelatorios = async () => {
        try {
            const response = await api.get('/relatorio-consulta')
            return { success: true, data: response.data }
        } catch (error) {
            console.error('Erro ao buscar o relatorio:', error);
            return { success: false, message: error };
        }
    }

    const findRelatorio = async (id) => {
        try {
            const response = await api.get(`/relatorio-consulta/${id}`)
            return { success: true, data: response.data }
        } catch (error) {
            console.error('Erro ao buscar o Usuário:', error);
            return { success: false, message: error };
        }
    }

    return {
        createServicoConsulta,
        findRelatorio,
        findRelatorios,
    }

}