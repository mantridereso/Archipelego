<?php

namespace SVB\CBS\ShippingWorldBundle\Controller;

use Symfony\Bundle\FrameworkBundle\Controller\Controller;
use Symfony\Component\HttpFoundation\Request;

class DefaultController extends Controller
{
    public function archipelagoAction(Request $request)
    {
        return $this->render('SVBCBSShippingWorldBundle:Default:archipelago.html.twig');
    }
}
