-- =====================================================
-- FIXTEC - FINAL SETUP AND ADJUSTMENTS
-- =====================================================

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_role ON public.profiles(role);
CREATE INDEX IF NOT EXISTS idx_profiles_email ON public.profiles(email);
CREATE INDEX IF NOT EXISTS idx_service_orders_client ON public.service_orders(client_id);
CREATE INDEX IF NOT EXISTS idx_service_orders_status ON public.service_orders(status);
CREATE INDEX IF NOT EXISTS idx_service_orders_number ON public.service_orders(order_number);
CREATE INDEX IF NOT EXISTS idx_service_history_order ON public.service_order_history(service_order_id);

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'FixTec database setup completed successfully!';
    RAISE NOTICE 'Tables created: profiles, clients, service_orders, service_order_history';
    RAISE NOTICE 'All RLS policies, triggers, and functions are in place';
    RAISE NOTICE 'Database is ready for use!';
END $$;
