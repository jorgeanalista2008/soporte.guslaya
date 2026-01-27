-- =====================================================
-- FIXTEC - TRIGGERS
-- =====================================================

-- Triggers for updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clients_updated_at BEFORE UPDATE ON public.clients
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_orders_updated_at BEFORE UPDATE ON public.service_orders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Trigger for new user signup
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Trigger for service order history
CREATE TRIGGER service_order_history_trigger
    AFTER INSERT OR UPDATE ON public.service_orders
    FOR EACH ROW EXECUTE FUNCTION create_service_order_history();
