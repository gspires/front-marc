import api from 'src/services/api';

export function useServicos() {

    const createServico = async (servico) => {
        try {
            const response = await api.post(`/servicos`, servico)
            return { success: true, data: response.data, message: 'Serviço cadastrado com sucesso!' }
        } catch (error) {
            console.error('Erro ao cadastrar o Serviço:', error);
            return { success: false, message: error };
        }
    }

    const findServicos = async () => {
        try {
            const response = await api.get('/servicos')
            return { success: true, data: response.data }
        } catch (error) {
            console.error('Erro ao buscar Serviços', error);
            return { success: false, message: error };
        }
    }
    const findServico = async (id) => {
        try {
            const response = await api.get(`/servicos/${id}`)
            return { success: true, data: response.data }
        } catch (error) {
            console.error('Erro ao buscar o Serviço:', error);
            return { success: false, message: error };
        }
    }

    const updateServico = async (id, servico) => {
        try {
            console.log(servico)
            const response = await api.put(`/servicos/${id}`, servico)
            return { success: true, data: response.data, message: 'Serviço alterado com sucesso!' }
        } catch (error) {
            console.error('Erro ao alterar o Serviço:', error);
            return { success: false, message: error };
        }
    }

    return {
        createServico,
        findServicos,
        findServico,
        updateServico
    }
}