import api from 'src/services/api';

export function useConsulta() {

    const createConsulta = async (consulta) => {
        try {
            const response = await api.post(`/consulta`, consulta)
            return { success: true, data: response.data, message: 'Consulta cadastrado com sucesso!' }
        } catch (error) {
            console.error('Erro ao cadastrar o Consulta:', error);
            return { success: false, message: error };
        }
    }

    const findConsultas = async () => {
        try {
            const response = await api.get('/consulta')
            return { success: true, data: response.data }
        } catch (error) {
            console.error('Erro ao buscar o consulta:', error);
            return { success: false, message: error };
        }
    }

    const consultaHistorico = async (id) => {
        try {
            const response = await api.get(`/consulta/hitorico-paricente/${id}`)
            return { success: true, data: response.data }
        } catch (error) {
            console.error('Erro ao buscar o consulta:', error);
            return { success: false, message: error };
        }
    }

    const findConsulta = async (id) => {
        try {
            const response = await api.get(`/consulta/${id}`)
            return { success: true, data: response.data }
        } catch (error) {
            console.error('Erro ao buscar o Usuário:', error);
            return { success: false, message: error };
        }
    }

    const updateConsulta = async (id, consulta) => {
        try {
            const response = await api.put(`/consulta/${id}`, consulta)
            return response.data
        } catch (error) {
            console.error('Erro ao alterar o Usuário:', error);
            return { success: false, message: error };
        }
    }

    const resumoStatus = async (mes, ano) => {
        try {
            const response = await api.get(`/consulta/resumo-status`, { params: { mes, ano } })
            return response.data
        } catch (error) {
            console.error('Erro ao retornar o resumo do status:', error);
            return { success: false, message: error };
        }
    }
    const resumoServico = async (mes, ano) => {
        try {
            const response = await api.get(`/consulta/resumo-servico`, { params: { mes, ano } })
            return response.data
        } catch (error) {
            console.error('Erro ao retornar o resumo do status:', error);
            return { success: false, message: error };
        }
    }
    const resumoFinanceiro = async (mes, ano) => {
        try {
            const response = await api.get(`/consulta/resumo-financeiro`, { params: { mes, ano } })
            return response.data
        } catch (error) {
            console.error('Erro ao retornar o resumo do status:', error);
            return { success: false, message: error };
        }
    }
    const findClientes = async (mes, ano) => {
        try {
            const response = await api.get('consulta/consulta-clientes', { params: { mes, ano } })
            return { success: true, data: response.data }
        } catch (error) {
            console.error('Erro ao buscar o consulta:', error);
            return { success: false, message: error };
        }
    }

    return {
        createConsulta,
        findConsultas,
        findConsulta,
        updateConsulta,
        consultaHistorico,
        resumoStatus,
        resumoServico,
        resumoFinanceiro,
        findClientes
    }
}